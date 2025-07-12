// LottieAnimation.tsx

import Lottie from "react-lottie";
import animationData from "@/data/confetti.json";

interface LottieAnimationProps {
  isActive: boolean;
  width?: number;
  height?: number;
}

export const LottieAnimation = ({
  isActive,
  width = 400,
  height = 200,
}: LottieAnimationProps) => {
  const defaultOptions = {
    loop: isActive,
    autoplay: isActive,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (!isActive) return null;

  return (
    <div className="absolute -bottom-5 right-0 z-50 pointer-events-none">
      <Lottie options={defaultOptions} height={height} width={width} />
    </div>
  );
};
