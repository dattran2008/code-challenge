import React, { useMemo } from "react";
import type { BaseIconProps } from "@/models/CmpProps";

const Icon: React.FC<BaseIconProps> = ({
  iconName,
  iconFormat = "svg",
  size = "md",
  animation,
  category = "tokens",
}) => {
  const sizeClass =
    {
      xs: "w-4 h-4",
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-10 h-10",
    }[size] || "w-8 h-8";

  const animationClass = animation
    ? {
        spin: "animate-spin",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
      }[animation] || ""
    : "";

  const iconSrc = useMemo(() => {
    try {
      return new URL(
        `../assets/icons/${category}/${iconName}.${iconFormat}`,
        import.meta.url,
      ).href;
    } catch (e) {
      return new URL("../assets/react.svg", import.meta.url).href;
    }
  }, [iconName, iconFormat, category]);

  return (
    <img
      src={iconSrc}
      alt={iconName}
      className={`${sizeClass} ${animationClass}`.trim()}
      loading="lazy"
    />
  );
};

export default Icon;
