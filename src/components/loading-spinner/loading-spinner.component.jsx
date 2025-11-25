import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-[#00000060] flex justify-center items-center h-screen z-60">
      <img
        src="https://res.cloudinary.com/dganx8kmn/image/upload/f_webp,q_auto/v1749909159/forms/Loading_Screen_nquaic.png"
        alt="Loading..."
        className="w-14 h-14 md:w-18 md:h-18 object-contain animate-spin"
      />
    </div>
  );
};

export default LoadingSpinner;
