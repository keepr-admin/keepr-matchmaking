
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: number;
  showLink?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 28, showLink = true }) => {
  const logoElement = (
    <div className="flex items-center justify-center">
      <img 
        src="/logo.png" 
        alt="Keepr Logo" 
        className="w-auto"
        style={{ height: `${size}px` }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
          target.onerror = null;
        }}
      />
    </div>
  );

  if (showLink) {
    return <Link to="/">{logoElement}</Link>;
  }

  return logoElement;
};

export default Logo;
