// Exodus 1-40 24FPS Room Images (Complete Book)
import exodus01 from "@/assets/chapters/exodus-01.jpg";
import exodus02 from "@/assets/chapters/exodus-02.jpg";
import exodus03 from "@/assets/chapters/exodus-03.jpg";
import exodus04 from "@/assets/chapters/exodus-04.jpg";
import exodus05 from "@/assets/chapters/exodus-05.jpg";
import exodus06 from "@/assets/chapters/exodus-06.jpg";
import exodus07 from "@/assets/chapters/exodus-07.jpg";
import exodus08 from "@/assets/chapters/exodus-08.jpg";
import exodus09 from "@/assets/chapters/exodus-09.jpg";
import exodus10 from "@/assets/chapters/exodus-10.jpg";
import exodus11 from "@/assets/chapters/exodus-11.jpg";
import exodus12 from "@/assets/chapters/exodus-12.jpg";
import exodus13 from "@/assets/chapters/exodus-13.jpg";
import exodus14 from "@/assets/chapters/exodus-14.jpg";
import exodus15 from "@/assets/chapters/exodus-15.jpg";
import exodus16 from "@/assets/chapters/exodus-16.jpg";
import exodus17 from "@/assets/chapters/exodus-17.jpg";
import exodus18 from "@/assets/chapters/exodus-18.jpg";
import exodus19 from "@/assets/chapters/exodus-19.jpg";
import exodus20 from "@/assets/chapters/exodus-20.jpg";
import exodus21 from "@/assets/chapters/exodus-21.jpg";
import exodus22 from "@/assets/chapters/exodus-22.jpg";
import exodus23 from "@/assets/chapters/exodus-23.jpg";
import exodus24 from "@/assets/chapters/exodus-24.jpg";
import exodus25 from "@/assets/chapters/exodus-25.jpg";
import exodus26 from "@/assets/chapters/exodus-26.jpg";
import exodus27 from "@/assets/chapters/exodus-27.jpg";
import exodus28 from "@/assets/chapters/exodus-28.jpg";
import exodus29 from "@/assets/chapters/exodus-29.jpg";
import exodus30 from "@/assets/chapters/exodus-30.jpg";
import exodus31 from "@/assets/chapters/exodus-31.jpg";
import exodus32 from "@/assets/chapters/exodus-32.jpg";
import exodus33 from "@/assets/chapters/exodus-33.jpg";
import exodus34 from "@/assets/chapters/exodus-34.jpg";
import exodus35 from "@/assets/chapters/exodus-35.jpg";
import exodus36 from "@/assets/chapters/exodus-36.jpg";
import exodus37 from "@/assets/chapters/exodus-37.jpg";
import exodus38 from "@/assets/chapters/exodus-38.jpg";
import exodus39 from "@/assets/chapters/exodus-39.jpg";
import exodus40 from "@/assets/chapters/exodus-40.jpg";

export const exodusImages = [
  exodus01, exodus02, exodus03, exodus04, exodus05,
  exodus06, exodus07, exodus08, exodus09, exodus10,
  exodus11, exodus12, exodus13, exodus14, exodus15,
  exodus16, exodus17, exodus18, exodus19, exodus20,
  exodus21, exodus22, exodus23, exodus24, exodus25,
  exodus26, exodus27, exodus28, exodus29, exodus30,
  exodus31, exodus32, exodus33, exodus34, exodus35,
  exodus36, exodus37, exodus38, exodus39, exodus40,
];

export const getExodusImage = (chapter: number): string => {
  if (chapter < 1 || chapter > 40) {
    throw new Error(`Chapter ${chapter} is out of range. Must be between 1 and 40.`);
  }
  return exodusImages[chapter - 1];
};
