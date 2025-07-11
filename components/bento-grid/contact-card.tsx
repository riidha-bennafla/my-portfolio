"use client";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import Lottie from "react-lottie";
import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "../ui/GradientBg";
import MagicButton from "../ui/MagicButton";
import animationData from "@/data/confetti.json";
import { BentoCardProps } from "./types";

interface ContactCardProps extends BentoCardProps {
  email?: string;
}

const EmailCopySection = ({
  email,
  copied,
  onCopy,
}: {
  email: string;
  copied: boolean;
  onCopy: () => void;
}) => {
  const lottieOptions = {
    loop: copied,
    autoplay: copied,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="mt-5 relative">
      <div
        className={`absolute -bottom-5 right-0 ${copied ? "block" : "block"}`}
      >
        <Lottie options={lottieOptions} height={200} width={400} />
      </div>
      <MagicButton
        title={copied ? "Email is Copied!" : "Copy my email address"}
        icon={<IoCopyOutline />}
        position="left"
        handleClick={onCopy}
        otherClasses="!bg-[#161A31]"
      />
    </div>
  );
};

export const ContactCard = ({
  className,
  title,
  description,
  titleClassName,
  email = "bennafla.riidha@gmail.com",
}: ContactCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      } else {
        // Modern clipboard API
        await navigator.clipboard.writeText(email);
      }

      setCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy email: ", error);
      // You might want to show a toast notification here
      alert("Failed to copy email. Please copy manually: " + email);
    }
  };

  const renderContent = () => (
    <div
      className={cn(
        titleClassName,
        "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
      )}
    >
      <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
        {description}
      </div>
      <div className="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10">
        {title}
      </div>
      <EmailCopySection email={email} copied={copied} onCopy={handleCopy} />
    </div>
  );

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
        className
      )}
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <div className={`flex justify-center h-full`}>
        <BackgroundGradientAnimation>
          <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
        </BackgroundGradientAnimation>
        {renderContent()}
      </div>
    </div>
  );
};
