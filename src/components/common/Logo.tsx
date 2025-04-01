
import React from "react";

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 28 }) => {
  return (
    <div 
      className="rounded-full bg-gradient-to-br from-repair-green-400 to-repair-yellow-400 p-1 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div className="text-white font-bold" style={{ fontSize: size * 0.6 }}>RB</div>
    </div>
  );
};

export default Logo;
