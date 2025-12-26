// Joshua chapter images (24 chapters)
import josh01 from "@/assets/chapters/joshua-01.jpg";
import josh02 from "@/assets/chapters/joshua-02.jpg";
import josh03 from "@/assets/chapters/joshua-03.jpg";
import josh04 from "@/assets/chapters/joshua-04.jpg";
import josh05 from "@/assets/chapters/joshua-05.jpg";
import josh06 from "@/assets/chapters/joshua-06.jpg";
import josh07 from "@/assets/chapters/joshua-07.jpg";
import josh08 from "@/assets/chapters/joshua-08.jpg";
import josh09 from "@/assets/chapters/joshua-09.jpg";
import josh10 from "@/assets/chapters/joshua-10.jpg";
import josh11 from "@/assets/chapters/joshua-11.jpg";
import josh12 from "@/assets/chapters/joshua-12.jpg";
import josh13 from "@/assets/chapters/joshua-13.jpg";
import josh14 from "@/assets/chapters/joshua-14.jpg";
import josh15 from "@/assets/chapters/joshua-15.jpg";
import josh16 from "@/assets/chapters/joshua-16.jpg";
import josh17 from "@/assets/chapters/joshua-17.jpg";
import josh18 from "@/assets/chapters/joshua-18.jpg";
import josh19 from "@/assets/chapters/joshua-19.jpg";
import josh20 from "@/assets/chapters/joshua-20.jpg";
import josh21 from "@/assets/chapters/joshua-21.jpg";
import josh22 from "@/assets/chapters/joshua-22.jpg";
import josh23 from "@/assets/chapters/joshua-23.jpg";
import josh24 from "@/assets/chapters/joshua-24.jpg";

export const joshuaImages = [
  josh01, josh02, josh03, josh04, josh05, josh06, josh07, josh08, josh09, josh10,
  josh11, josh12, josh13, josh14, josh15, josh16, josh17, josh18, josh19, josh20,
  josh21, josh22, josh23, josh24
];

export const getJoshuaImage = (chapter: number): string | undefined => {
  if (chapter >= 1 && chapter <= 24) {
    return joshuaImages[chapter - 1];
  }
  return undefined;
};
