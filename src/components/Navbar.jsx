import React, { useEffect, useState, useRef } from "react";
import { logo, menu, close } from "../assets"; // Đảm bảo bạn đã import các file SVG
import styled from "styled-components";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`w-full flex items-center h-16 fixed top-0 z-50 bg-transparent`}
    >
      <div className="w-full h-full flex flex-1 flex-row justify-between px-3">
        <div className="w-36 flex justify-center gap-4 flex-row items-center h-full">
          {/* <img src={logo} alt="Close menu" className="w-auto h-8" />
          <span className="font-medium text-slate-200">Trinh-DC</span> */}
        </div>
   
        <div className="w-14 h-full flex justify-center items-center ">
          <div
            className="relative w-8 h-6 cursor-pointer flex flex-col justify-between"
            onClick={toggleMenu}
          >
            {isOpen ? (
              <img src={close} alt="Close menu" className="w-full h-full" />
            ) : (
              <img src={menu} alt="Open menu" className="w-full h-full" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
