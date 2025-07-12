// ConfettiAnimation.tsx

import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export const ConfettiAnimation = () => {
  const { width, height } = useWindowSize();

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.3}
    />
  );
};
