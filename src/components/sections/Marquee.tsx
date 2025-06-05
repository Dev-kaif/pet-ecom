import { cn } from "@/components/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import React from "react"; 

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
}

function MarqueeElement({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:5s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

// Your Page component where you use the Marquee (now using MarqueeElement internally)
export default function Marquee() {
  return (
    <div className="overflow-hidden bg-primary py-2 h-[12vh] flex items-center">
      <MarqueeElement
        repeat={10} 
        pauseOnHover={true} 
        className="text-white text-xl font-bold " // Styles applied to the Marquee container
      >
        <span className="mr-4">Book an Appointment</span>
        <Image
          src={"/images/images/marquee_icon.svg"}
          alt="marquee-icon"
          width={24} 
          height={24}
          className="inline-block align-middle mr-8" 
        />
      </MarqueeElement>
    </div>
  );
}