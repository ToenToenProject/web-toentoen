'use client';

import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
};

/** Image component with automatic fallback handling when target source fails to load. */
export const ImageWithFallback = ({ src, alt, fallback, className }: Props) => {
  const [current, setCurrent] = useState(src);
  return (
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
};
