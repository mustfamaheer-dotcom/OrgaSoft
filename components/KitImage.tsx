import React, { useState } from 'react';
import { getOptimizedUrl } from '../lib/imagekit';

interface KitImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'auto';
  loading?: 'lazy' | 'eager';
}

const KitImage: React.FC<KitImageProps> = ({
  src,
  width,
  height,
  quality = 80,
  format = 'auto',
  className = '',
  loading = 'lazy',
  alt = '',
  style,
  ...rest
}) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="w-8 h-8 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const optimizedSrc = getOptimizedUrl(src, {
    width: width && width > 0 ? width : undefined,
    height: height && height > 0 ? height : undefined,
    quality,
    format,
  });

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onError={() => setError(true)}
      className={className}
      style={style}
      {...rest}
    />
  );
};

export default KitImage;
