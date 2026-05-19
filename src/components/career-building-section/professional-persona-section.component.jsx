import React from "react";

const ProfessionalPersonaSection = () => {
  return (
    <div className="px-[5%] pt-15 pb-10 w-full flex flex-col md:flex-row md:justify-between space-y-5 md:space-y-0 md:space-x-3 xl:space-x-0">
      <div className="relative xl:w-[24%] h-[280px] md:h-[450px] xl:h-[503px] bg-transparent border-[1.5px] border-[#ffffff63] rounded-xl p-1">
        <video
          className="w-full h-full rounded-[8px] object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://res.cloudinary.com/dganx8kmn/video/upload/v1758907521/Hello%20dreams%20%20AI/GettyImages-1269667975_fzjqhb.mp4"
            type="video/mp4"
          />
        </video>

        <p className="absolute bottom-15 text-[20px] md:text-[28px] xl:text-[36px] font-bold px-1 leading-[1] tracking-tighter">
          LinkedIn
          <br />
          Optimiser
        </p>
      </div>
      <div className="relative xl:w-[45%] h-[280px] md:h-[450px] xl:h-[503px] bg-[#ffffff]/5 border-[1.5px] border-[#ffffff63] rounded-xl p-1 ">
        <video
          className="w-full h-full rounded-[8px] object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://res.cloudinary.com/dganx8kmn/video/upload/v1758907545/Hello%20dreams%20%20AI/6504166_Abstract_Blue_1920x1080_i2ovze.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute bottom-15 px-3">
          <p className="text-[20px] md:text-[28px] xl:text-[36px] font-bold leading-[1] mb-5 tracking-tighter ">
            Create a<br />
            professional persona
          </p>
          <p className="text-[#eaecf0] text-[16px] md:text-[18px] xl:text-[20px] ">
            Touch excellence with portfolios that showcase your work like a
            museum exhibition. Every project, perfectly presented.
          </p>
        </div>
      </div>
      <div className="relative xl:w-[24%] h-[280px] md:h-[450px] xl:h-[503px] bg-transparent border-[1.5px] border-[#ffffff63] rounded-xl p-1">
        <video
          className="w-full h-full rounded-[8px] object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://res.cloudinary.com/dganx8kmn/video/upload/v1758907526/Hello%20dreams%20%20AI/0_Abstract_Colorful_1920x1080_v2cwj9.mp4"
            type="video/mp4"
          />
        </video>

        <p className="absolute bottom-15 text-[20px] md:text-[28px] xl:text-[36px] font-bold px-1 leading-[1] tracking-tighter">
          Professional
          <br />
          Headshot
        </p>
      </div>
    </div>
  );
};

export default ProfessionalPersonaSection;
