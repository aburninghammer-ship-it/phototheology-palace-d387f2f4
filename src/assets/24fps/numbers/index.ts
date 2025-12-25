// Numbers chapter images (36 chapters)
import num01 from "@/assets/chapters/numbers-01.jpg";
import num02 from "@/assets/chapters/numbers-02.jpg";
import num03 from "@/assets/chapters/numbers-03.jpg";
import num04 from "@/assets/chapters/numbers-04.jpg";
import num05 from "@/assets/chapters/numbers-05.jpg";
import num06 from "@/assets/chapters/numbers-06.jpg";
import num07 from "@/assets/chapters/numbers-07.jpg";
import num08 from "@/assets/chapters/numbers-08.jpg";
import num09 from "@/assets/chapters/numbers-09.jpg";
import num10 from "@/assets/chapters/numbers-10.jpg";
import num11 from "@/assets/chapters/numbers-11.jpg";
import num12 from "@/assets/chapters/numbers-12.jpg";
import num13 from "@/assets/chapters/numbers-13.jpg";
import num14 from "@/assets/chapters/numbers-14.jpg";
import num15 from "@/assets/chapters/numbers-15.jpg";
import num16 from "@/assets/chapters/numbers-16.jpg";
import num17 from "@/assets/chapters/numbers-17.jpg";
import num18 from "@/assets/chapters/numbers-18.jpg";
import num19 from "@/assets/chapters/numbers-19.jpg";
import num20 from "@/assets/chapters/numbers-20.jpg";
import num21 from "@/assets/chapters/numbers-21.jpg";
import num22 from "@/assets/chapters/numbers-22.jpg";
import num23 from "@/assets/chapters/numbers-23.jpg";
import num24 from "@/assets/chapters/numbers-24.jpg";
import num25 from "@/assets/chapters/numbers-25.jpg";
import num26 from "@/assets/chapters/numbers-26.jpg";
import num27 from "@/assets/chapters/numbers-27.jpg";
import num28 from "@/assets/chapters/numbers-28.jpg";
import num29 from "@/assets/chapters/numbers-29.jpg";
import num30 from "@/assets/chapters/numbers-30.jpg";
import num31 from "@/assets/chapters/numbers-31.jpg";
import num32 from "@/assets/chapters/numbers-32.jpg";
import num33 from "@/assets/chapters/numbers-33.jpg";
import num34 from "@/assets/chapters/numbers-34.jpg";
import num35 from "@/assets/chapters/numbers-35.jpg";
import num36 from "@/assets/chapters/numbers-36.jpg";

export const numbersImages = [
  num01, num02, num03, num04, num05, num06, num07, num08, num09, num10,
  num11, num12, num13, num14, num15, num16, num17, num18, num19, num20,
  num21, num22, num23, num24, num25, num26, num27, num28, num29, num30,
  num31, num32, num33, num34, num35, num36
];

export const getNumbersImage = (chapter: number): string | undefined => {
  if (chapter >= 1 && chapter <= 36) {
    return numbersImages[chapter - 1];
  }
  return undefined;
};
