import React from 'react';

interface KharisLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const KharisLogo: React.FC<KharisLogoProps> = ({ 
  className = '', 
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-20',
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* Official Kharis Church Logo Image with invert filter to clear the white background box */}
      <img 
        src="/kharis-logo.png" 
        alt="Kharis Church Logo" 
        className={`${sizeMap[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02] filter brightness-0 invert`}
      />
    </div>
  );
};

export default KharisLogo;