import React from "react";

const ReadyToFeelSuccess = () => {
  return (
    <div className="py-10 px-[5%]">
      <div className="flex justify-between items-center mb-10 ">
        <div>
          <p className="text-[64px] font-bold tracking-tighter">
            Ready to Feel Success?
          </p>
          <p className="w-[593px] text-[#eaecf0] text-[20px]">
            Join thousands who've transformed their careers. Experience the
            difference AI-powered precision makes
          </p>
        </div>
        <button className="bg-[#1342ff] text-white border border-[#1342ff] font-bold text-[12px] md:text-[16px] xl:text-[18px] px-6 py-2 rounded-md hover:bg-[#1b13ff] hover:border-[#1b13ff] cursor-pointer transition-colors duration-300">
          Start your journey for free
        </button>
      </div>
      <div className="my-10 p-[1.5px] rounded-xl bg-gradient-to-r from-[#ffffffad] to-[#ffffff3d] shadow-[0_0_70px_40px_rgba(255,0,230,0.3)]">
        <div className="relative w-full flex justify-center items-center h-[880px] bg-black rounded-xl px-5 py-8">
          <video
            className="w-full h-full rounded-3xl object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="https://res.cloudinary.com/dganx8kmn/video/upload/v1759354005/Hello%20dreams%20%20AI/0_3d_Model_Triangle_1920x1080_vnwrjv.mp4"
              type="video/mp4"
            />
          </video>

          <button
            className="absolute w-[476px] text-center py-3 border border-[#eaecf0] bg-[linear-gradient(to_bottom,_#eaecf0_0%,_#c5c8d0_30%,_#010413_100%)] 
 text-[#fff] text-[24px] font-bold rounded-xl tracking-tighter shadow-[0_30px_80px_-10px_rgba(255,215,0,0.5),_0_-30px_80px_-10px_rgba(255,215,0,0.5)] cursor-pointer "
          >
            Start Your Journey for Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadyToFeelSuccess;
