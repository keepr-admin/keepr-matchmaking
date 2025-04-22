
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: number;
  showLink?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 28, showLink = true }) => {
  const LOGO_URL = "https://aypguznvqocrpbfrjhnr.supabase.co/storage/v1/object/public/branding//Keepr%20logo%20draft%20-%20heart.png";
  
  const logoElement = (
    <div className="flex items-center justify-center">
      <img 
        src={LOGO_URL}
        alt="Keepr Logo" 
        className="w-auto h-auto"
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
