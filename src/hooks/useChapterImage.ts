import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChapterImageData {
  imageUrl: string | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
}

interface UseChapterImageOptions {
  book: string;
  chapter: number;
  title: string;
  summary: string;
  symbol: string;
  autoLoad?: boolean;
}

export function useChapterImage({
  book,
  chapter,
  title,
  summary,
  symbol,
  autoLoad = true,
}: UseChapterImageOptions) {
  const [data, setData] = useState<ChapterImageData>({
    imageUrl: null,
    isLoading: autoLoad,
    isGenerating: false,
    error: null,
  });

  // Check for existing image in database
  const checkForExistingImage = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, isLoading: true, error: null }));

      const { data: images, error } = await supabase
        .from("bible_images")
        .select("image_url")
        .eq("book", book)
        .eq("chapter", chapter)
        .eq("room_type", "24fps")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (images && images.length > 0) {
        setData({
          imageUrl: images[0].image_url,
          isLoading: false,
          isGenerating: false,
          error: null,
        });
        return images[0].image_url;
      }

      setData((prev) => ({ ...prev, imageUrl: null, isLoading: false }));
      return null;
    } catch (err) {
      console.error("Error checking for image:", err);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to check for existing image",
      }));
      return null;
    }
  }, [book, chapter]);

  // Generate a new image
  const generateImage = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, isGenerating: true, error: null }));

      // Create a unique prompt based on chapter content
      const prompt = `Create a memorable symbolic visual anchor for ${book} chapter ${chapter}: "${title}". ${summary}. The symbol is ${symbol}. Make it vivid, symbolic, and suitable for Bible memorization using the 24FPS method. Style: Clear, striking imagery that captures the essence of this chapter.`;

      const { data: response, error: fnError } = await supabase.functions.invoke(
        "generate-visual-anchor",
        {
          body: { prompt },
        }
      );

      if (fnError) throw fnError;

      if (!response?.image) {
        throw new Error("No image generated");
      }

      // The image is base64, we need to upload it to storage
      const base64Data = response.image.replace(/^data:image\/\w+;base64,/, "");
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // Upload to storage
      const fileName = `24fps/${book.toLowerCase()}/${book.toLowerCase()}-${chapter}-${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("bible-images")
        .upload(fileName, blob, {
          contentType: "image/png",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("bible-images")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Get current user (if authenticated)
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (userId) {
        // Save to database
        const { error: insertError } = await supabase.from("bible_images").insert({
          user_id: userId,
          book,
          chapter,
          image_url: publicUrl,
          description: `${book} ${chapter}: ${title}`,
          room_type: "24fps",
          is_public: true,
          is_favorite: false,
        });

        if (insertError) {
          console.error("Error saving image to database:", insertError);
        }
      }

      setData({
        imageUrl: publicUrl,
        isLoading: false,
        isGenerating: false,
        error: null,
      });

      toast.success(`Generated image for ${book} ${chapter}`);
      return publicUrl;
    } catch (err: any) {
      console.error("Error generating image:", err);
      const errorMessage = err.message || "Failed to generate image";
      setData((prev) => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      return null;
    }
  }, [book, chapter, title, summary, symbol]);

  // Load existing image on mount
  useEffect(() => {
    if (autoLoad) {
      checkForExistingImage();
    }
  }, [autoLoad, checkForExistingImage]);

  return {
    ...data,
    checkForExistingImage,
    generateImage,
  };
}

// Batch check for multiple chapters
export async function batchCheckChapterImages(
  chapters: { book: string; chapter: number }[]
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  if (chapters.length === 0) return results;

  try {
    // Build OR conditions for all chapters
    const conditions = chapters.map(
      (ch) => `and(book.eq.${ch.book},chapter.eq.${ch.chapter})`
    );

    const { data: images, error } = await supabase
      .from("bible_images")
      .select("book, chapter, image_url")
      .eq("room_type", "24fps")
      .eq("is_public", true)
      .or(conditions.join(","));

    if (error) throw error;

    images?.forEach((img) => {
      const key = `${img.book}-${img.chapter}`;
      if (!results.has(key)) {
        results.set(key, img.image_url);
      }
    });
  } catch (err) {
    console.error("Error batch checking images:", err);
  }

  return results;
}
