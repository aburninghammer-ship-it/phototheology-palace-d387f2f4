// Deuteronomy chapter images (34 chapters)
import deut01 from "@/assets/chapters/deuteronomy-01.jpg";
import deut02 from "@/assets/chapters/deuteronomy-02.jpg";
import deut03 from "@/assets/chapters/deuteronomy-03.jpg";
import deut04 from "@/assets/chapters/deuteronomy-04.jpg";
import deut05 from "@/assets/chapters/deuteronomy-05.jpg";
import deut06 from "@/assets/chapters/deuteronomy-06.jpg";
import deut07 from "@/assets/chapters/deuteronomy-07.jpg";
import deut08 from "@/assets/chapters/deuteronomy-08.jpg";
import deut09 from "@/assets/chapters/deuteronomy-09.jpg";
import deut10 from "@/assets/chapters/deuteronomy-10.jpg";
import deut11 from "@/assets/chapters/deuteronomy-11.jpg";
import deut12 from "@/assets/chapters/deuteronomy-12.jpg";
import deut13 from "@/assets/chapters/deuteronomy-13.jpg";
import deut14 from "@/assets/chapters/deuteronomy-14.jpg";
import deut15 from "@/assets/chapters/deuteronomy-15.jpg";
import deut16 from "@/assets/chapters/deuteronomy-16.jpg";
import deut17 from "@/assets/chapters/deuteronomy-17.jpg";
import deut18 from "@/assets/chapters/deuteronomy-18.jpg";
import deut19 from "@/assets/chapters/deuteronomy-19.jpg";
import deut20 from "@/assets/chapters/deuteronomy-20.jpg";
import deut21 from "@/assets/chapters/deuteronomy-21.jpg";
import deut22 from "@/assets/chapters/deuteronomy-22.jpg";
import deut23 from "@/assets/chapters/deuteronomy-23.jpg";
import deut24 from "@/assets/chapters/deuteronomy-24.jpg";
import deut25 from "@/assets/chapters/deuteronomy-25.jpg";
import deut26 from "@/assets/chapters/deuteronomy-26.jpg";
import deut27 from "@/assets/chapters/deuteronomy-27.jpg";
import deut28 from "@/assets/chapters/deuteronomy-28.jpg";
import deut29 from "@/assets/chapters/deuteronomy-29.jpg";
import deut30 from "@/assets/chapters/deuteronomy-30.jpg";
import deut31 from "@/assets/chapters/deuteronomy-31.jpg";
import deut32 from "@/assets/chapters/deuteronomy-32.jpg";
import deut33 from "@/assets/chapters/deuteronomy-33.jpg";
import deut34 from "@/assets/chapters/deuteronomy-34.jpg";

export const deuteronomyImages = [
  deut01, deut02, deut03, deut04, deut05, deut06, deut07, deut08, deut09, deut10,
  deut11, deut12, deut13, deut14, deut15, deut16, deut17, deut18, deut19, deut20,
  deut21, deut22, deut23, deut24, deut25, deut26, deut27, deut28, deut29, deut30,
  deut31, deut32, deut33, deut34
];

export const getDeuteronomyImage = (chapter: number): string | undefined => {
  if (chapter >= 1 && chapter <= 34) {
    return deuteronomyImages[chapter - 1];
  }
  return undefined;
};
