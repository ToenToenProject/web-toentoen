import Image from "next/image";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  showText?: boolean;
  size?: number;
};

export const Logo = ({
  variant = "light",
  className = "",
  showText = true,
  size = 36,
}: LogoProps) => {
  const textColor = variant === "light" ? "text-gray-900" : "text-white";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Icon Logo Resmi ToenToen dengan aria-hidden agar screen reader membaca teks Toentoen secara bersih */}
      <Image
        src="/assets/logo/toentoen-logo.png"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className="rounded-xl object-contain shadow-xs flex-shrink-0"
        style={{ width: `${size}px`, height: `${size}px` }}
        priority
      />
      {/* Wordmark satu baris "ToenToen" */}
      {showText && (
        <span className={`text-xl font-extrabold tracking-tight ${textColor}`} aria-label="ToenToen">
          ToenToen
        </span>
      )}
    </span>
  );
};
