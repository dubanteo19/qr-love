import { type FC } from "react";
import * as THREE from "three";
import { FloatingText } from "./FloatingText";

const glowColors = ["#ff77ff", "#ffcc00", "#00ffff", "#ff6699"];

const TOTAL_TEXTS = 500;

export const FloatingTextField: FC<{ phrases: string[] }> = ({ phrases }) => {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <>
      {Array.from({ length: TOTAL_TEXTS }).map((_, i) => {
        const content = phrases[i % phrases.length]; // repeat phrases
        const glowColor =
          glowColors[Math.floor(Math.random() * glowColors.length)];
        const initialPosition = new THREE.Vector3(
          Math.random() * 20 - 10,
          -2 - Math.random() * 10,
          Math.random() * 20 - 10,
        );

        const baseSize = isMobile ? 0.05 : 0.1;
        const size = baseSize + Math.random() * 0.1;
        const speed = 0.3 + Math.random() * 0.65;

        return (
          <FloatingText
            key={i}
            content={content}
            initialPosition={initialPosition}
            size={size}
            speed={speed}
            glowColor={glowColor}
          />
        );
      })}
    </>
  );
};
