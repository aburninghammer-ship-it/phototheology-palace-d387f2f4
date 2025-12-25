// Leviticus chapter images (27 chapters)
import lev01 from "@/assets/chapters/leviticus-01.jpg";
import lev02 from "@/assets/chapters/leviticus-02.jpg";
import lev03 from "@/assets/chapters/leviticus-03.jpg";
import lev04 from "@/assets/chapters/leviticus-04.jpg";
import lev05 from "@/assets/chapters/leviticus-05.jpg";
import lev06 from "@/assets/chapters/leviticus-06.jpg";
import lev07 from "@/assets/chapters/leviticus-07.jpg";
import lev08 from "@/assets/chapters/leviticus-08.jpg";
import lev09 from "@/assets/chapters/leviticus-09.jpg";
import lev10 from "@/assets/chapters/leviticus-10.jpg";
import lev11 from "@/assets/chapters/leviticus-11.jpg";
import lev12 from "@/assets/chapters/leviticus-12.jpg";
import lev13 from "@/assets/chapters/leviticus-13.jpg";
import lev14 from "@/assets/chapters/leviticus-14.jpg";
import lev15 from "@/assets/chapters/leviticus-15.jpg";
import lev16 from "@/assets/chapters/leviticus-16.jpg";
import lev17 from "@/assets/chapters/leviticus-17.jpg";
import lev18 from "@/assets/chapters/leviticus-18.jpg";
import lev19 from "@/assets/chapters/leviticus-19.jpg";
import lev20 from "@/assets/chapters/leviticus-20.jpg";
import lev21 from "@/assets/chapters/leviticus-21.jpg";
import lev22 from "@/assets/chapters/leviticus-22.jpg";
import lev23 from "@/assets/chapters/leviticus-23.jpg";
import lev24 from "@/assets/chapters/leviticus-24.jpg";
import lev25 from "@/assets/chapters/leviticus-25.jpg";
import lev26 from "@/assets/chapters/leviticus-26.jpg";
import lev27 from "@/assets/chapters/leviticus-27.jpg";

export const leviticusImages = [
  lev01, lev02, lev03, lev04, lev05, lev06, lev07, lev08, lev09, lev10,
  lev11, lev12, lev13, lev14, lev15, lev16, lev17, lev18, lev19, lev20,
  lev21, lev22, lev23, lev24, lev25, lev26, lev27
];

export const getLeviticusImage = (chapter: number): string | undefined => {
  if (chapter >= 1 && chapter <= 27) {
    return leviticusImages[chapter - 1];
  }
  return undefined;
};
