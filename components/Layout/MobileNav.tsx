import React from "react";

const MobileNav: React.FC = () => {
  return (
    <nav
      className="fixed top-0 left-0 w-full h-14 flex items-center px-4 bg-white shadow z-50 lg:hidden"
      role="navigation"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center">
        <span
          className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white font-bold text-lg select-none"
          aria-label="Selal logo S"
        >
          S
        </span>
        <span className="ml-2 font-bold text-lg text-gray-900 select-none">
          Selal Logo
        </span>
      </div>
      {/* Future nav items or menu button can go here */}
    </nav>
  );
};

export default MobileNav;
