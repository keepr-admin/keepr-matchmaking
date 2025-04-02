
import React from "react";

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 28 }) => {
  return (
    <div className="flex items-center justify-center">
      <img 
        src="/logo.png" 
        alt="Keepr Logo" 
        className={`w-auto`}
        style={{ height: `${size}px` }}
      />
    </div>
  );
};

export default Logo;
