import React from "react";
import {companyImage} from "../assets";

const Footer = () => {
  return (
    <footer className="w-full p-6 flex justify-center items-center bg-gray-700 bg-opacity-50 text-white mt-10 relative z-10">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm md:text-base font-semibold">Powered by Zeotap</span>
        <img
          src={companyImage}
          alt="Zeotap Logo"
          className="h-8 md:h-10 w-auto"
        />
      </div>
    </footer>
  );
};

export default Footer;
