import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const ReadyToFeelSuccess = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="py-10 px-[5%]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="flex flex-col xl:flex-row xl:justify-between xl:items-center mb-10 "
      >
        <div>
          <p className="text-[30px] md:text-[50px] xl:text-[64px] font-bold tracking-tighter">
            Ready to Feel Success?
          </p>
          <p className="md:w-[593px] text-[#eaecf0] text-[16px] md:text-[20px]">
            Join thousands who've transformed their careers. Experience the
            difference AI-powered precision makes
          </p>
        </div>
        <motion.button
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden xl:inline bg-[#1342ff] text-white border mt-5 border-[#1342ff] font-bold text-[12px] md:text-[16px] xl:text-[18px] px-6 py-2 rounded-md hover:bg-[#1b13ff] hover:border-[#1b13ff] cursor-pointer transition-colors duration-300"
        >
          Start your journey for free
        </motion.button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: 0.15,
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="my-10 p-[1.5px] rounded-xl bg-gradient-to-r from-[#ffffffad] to-[#ffffff3d] shadow-[0_0_70px_40px_rgba(255,0,230,0.3)]"
      >
        <div className="relative w-full flex justify-center items-center h-[240px] md:h-[480px] xl:h-[880px] bg-black rounded-xl p-2 md:px-5 md:py-8">
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

          <motion.button
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              scale: 1.03,
            }}
            className="absolute w-[80%] md:w-[376px] xl:w-[476px] text-center px-3 py-2 md:py-3 border border-[#eaecf0] bg-[linear-gradient(to_bottom,_#eaecf0_0%,_#c5c8d0_30%,_#010413_100%)] 
 text-[#fff] text-[16px] md:text-[20px] xl:text-[24px] font-bold rounded-xl tracking-tighter shadow-[0_30px_80px_-10px_rgba(255,215,0,0.5),_0_-30px_80px_-10px_rgba(255,215,0,0.5)] cursor-pointer "
          >
            Start Your Journey for Free
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReadyToFeelSuccess;
