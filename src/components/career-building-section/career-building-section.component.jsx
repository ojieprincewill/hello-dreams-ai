import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    filter: "blur(10px)",
  },

  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      delay: i * 0.12,
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};
const CareerBuildingSection = () => {
  return (
    <div className="relative bg-[url('https://res.cloudinary.com/dganx8kmn/image/upload/v1758894548/Hello%20dreams%20%20AI/621498e13ea68c102f5a94e3c9ed1709ea46e149_cvpxoj.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/70 z-0" />
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
        }}
        className="relative z-10 px-[5%] pt-10 "
      >
        <p className="text-[30px] w-[320px] md:w-[400px] xl:w-full md:text-[50px] xl:text-[64px] font-bold leading-tight tracking-tighter">
          Feel the Future of Career Building
        </p>
        <p className="w-full md:w-[593px] text-[#eaecf0] text-[16px] md:text-[20px] mt-3">
          Every tool designed to make you feel confident, look professional, and
          sound compelling.
        </p>

        <div className="md:min-h-[1218px] grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5 mt-10">
          <div className="flex flex-col gap-4 xl:gap-8">
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 0 60px rgba(19,66,255,.28)",
                transition: {
                  duration: 0.3,
                },
              }}
              className="md:h-[60%] flex flex-col justify-center p-6 rounded-xl bg-[#ffffff]/5 backdrop-blur-sm border-[1.5px] border-[#ffffff63]"
            >
              <motion.img
                whileHover={{
                  rotate: [0, -2, 2, -2, 0],
                  scale: 1.05,
                }}
                transition={{
                  duration: 0.6,
                }}
                src="https://res.cloudinary.com/dganx8kmn/image/upload/v1758900756/Hello%20dreams%20%20AI/b2855d3699f5fc66f06c85885fba63d9d734707f_a8xs6k.png"
                alt="clipboard"
                className="max-w-[150px] max-h-[127px] md:max-w-[180px] md:max-h-[157px] xl:max-w-[200px] xl:max-h-[177px] object-contain"
              />
              <p className="text-[30px] md:text-[50px] xl:text-[64px] font-bold leading-[1] mb-2 md:mb-3 xl:mb-5 tracking-tighter">
                AI CV Builder
              </p>
              <p className=" text-[#eaecf0] text-[16px] md:text-[20px]">
                Feel the satisfaction of a perfectly crafted CV. Our AI
                understands your story and presents it beautifully.
              </p>
            </motion.div>
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                y: {
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 0 60px rgba(19,66,255,.28)",
                transition: {
                  duration: 0.3,
                },
              }}
              className="md:h-[40%] flex flex-col justify-center p-6 rounded-xl bg-[#ffffff]/5 backdrop-blur-sm border-[1.5px] border-[#ffffff63]"
            >
              <motion.img
                whileHover={{
                  rotate: [0, -2, 2, -2, 0],
                  scale: 1.05,
                }}
                transition={{
                  duration: 0.6,
                }}
                src="https://res.cloudinary.com/dganx8kmn/image/upload/v1758900756/Hello%20dreams%20%20AI/b2855d3699f5fc66f06c85885fba63d9d734707f_a8xs6k.png"
                alt="clipboard"
                className="max-w-[150px] max-h-[127px] md:max-w-[180px] md:max-h-[157px] xl:max-w-[200px] xl:max-h-[177px] object-contain"
              />
              <p className="text-[30px] md:text-[50px] xl:text-[64px] font-bold leading-[1] mb-2 md:mb-3 xl:mb-5 tracking-tighter">
                Application Mastery
              </p>
              <p className=" text-[#eaecf0] text-[16px] md:text-[20px]">
                Hear success calling. Track, optimize, and master your job
                applications with insights that give you the edge.
              </p>
            </motion.div>
          </div>
          <div className="flex flex-col gap-4 xl:gap-8">
            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                y: {
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 0 60px rgba(19,66,255,.28)",
                transition: {
                  duration: 0.3,
                },
              }}
              className="md:h-[40%] flex flex-col justify-center p-6 rounded-xl bg-[#ffffff]/5 backdrop-blur-sm border-[1.5px] border-[#ffffff63]"
            >
              <motion.img
                whileHover={{
                  rotate: [0, -2, 2, -2, 0],
                  scale: 1.05,
                }}
                transition={{
                  duration: 0.6,
                }}
                src="https://res.cloudinary.com/dganx8kmn/image/upload/v1758900756/Hello%20dreams%20%20AI/b2855d3699f5fc66f06c85885fba63d9d734707f_a8xs6k.png"
                alt="clipboard"
                className="max-w-[150px] max-h-[127px] md:max-w-[180px] md:max-h-[157px] xl:max-w-[200px] xl:max-h-[177px] object-contain"
              />
              <p className="text-[30px] md:text-[50px] xl:text-[64px] font-bold leading-[1] mb-2 md:mb-3 xl:mb-5 tracking-tighter">
                Professional Presence
              </p>
              <p className=" text-[#eaecf0] text-[16px] md:text-[20px]">
                See your professional image transform. Build personas that
                recruiters remember and employers trust
              </p>
            </motion.div>
            <motion.div
              custom={3}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                y: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 0 60px rgba(19,66,255,.28)",
                transition: {
                  duration: 0.3,
                },
              }}
              className="md:h-[60%] flex flex-col justify-center p-6 rounded-xl bg-[#ffffff]/5 backdrop-blur-sm border-[1.5px] border-[#ffffff63]"
            >
              <motion.img
                whileHover={{
                  rotate: [0, -2, 2, -2, 0],
                  scale: 1.05,
                }}
                transition={{
                  duration: 0.6,
                }}
                src="https://res.cloudinary.com/dganx8kmn/image/upload/v1758900756/Hello%20dreams%20%20AI/b2855d3699f5fc66f06c85885fba63d9d734707f_a8xs6k.png"
                alt="clipboard"
                className="max-w-[150px] max-h-[127px] md:max-w-[180px] md:max-h-[157px] xl:max-w-[200px] xl:max-h-[177px] object-contain"
              />
              <p className="text-[30px] md:text-[50px] xl:text-[64px] font-bold leading-[1] mb-2 md:mb-3 xl:mb-5 tracking-tighter">
                Portfolio Perfection
              </p>
              <p className=" text-[#eaecf0] text-[16px] md:text-[20px]">
                Touch excellence with portfolios that showcase your work like a
                museum exhibition. Every project, perfectly presented.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CareerBuildingSection;
