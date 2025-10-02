import React from "react";

const LandingHeader = () => {
  return (
    <div className="w-full px-[5%]">
      <div className="my-5 py-10 flex flex-col justify-center items-center ">
        <button
          className="w-[476px] text-center py-3 border border-[#eaecf0] bg-[linear-gradient(to_bottom,_#8aa1ff_0%,_#8aa1ff_60%,_#becbff_85%,_#ffffff_100%)]
 text-[#fff] text-[24px] font-bold rounded-xl tracking-tighter shadow-[0_30px_80px_-10px_rgba(255,215,0,0.5),_0_-30px_80px_-10px_rgba(255,215,0,0.5)] mt-12 mb-6 cursor-pointer"
        >
          AI Powered career tool
        </button>
        <p className="text-center text-[80px] font-bold w-[768px] leading-[1] tracking-tighter mb-6 ">
          Build Your Career with{" "}
          <span className="text-[#1342ff]">Hello Dreams AI</span>
        </p>
        <p className="w-[696px] text-[20px] text-[#eaecf0] text-center">
          Experience the future of career development. Our AI doesn't just help
          —it understands, adapts, and creates experiences so intuitive, you'll
          feel like you're touching tomorrow.
        </p>
      </div>

      <div className="p-[1.5px] rounded-xl bg-gradient-to-r from-[#ffffffad] to-[#ffffff3d] shadow-[0_0_70px_40px_rgba(12,75,246,0.4)] mb-10">
        <div className="w-full h-[880px] bg-black rounded-xl px-5 py-8">
          <video
            className="w-full h-full rounded-3xl object-cover"
            autoPlay
            loop
            muted
            controls
            playsInline
          >
            <source
              src="https://res.cloudinary.com/dganx8kmn/video/upload/v1758920900/Hello%20dreams%20%20AI/0802_qpwdws.mov"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </div>
  );
};

export default LandingHeader;
