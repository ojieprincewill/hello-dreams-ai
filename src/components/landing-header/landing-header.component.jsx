import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const LandingHeader = () => {
  const title = "Build Your Career with ";

  return (
    <div className="w-full px-[5%]">
      <div className="my-1 py-4 md:my-5 md:py-10 flex flex-col justify-center items-center ">
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
          className="w-[80%] md:w-[376px] xl:w-[476px] text-center py-2 md:py-3 border border-[#eaecf0] bg-[linear-gradient(to_bottom,_#8aa1ff_0%,_#8aa1ff_60%,_#becbff_85%,_#ffffff_100%)]
 text-[#fff] text-[16px] md:text-[20px] xl:text-[24px] font-bold rounded-xl tracking-tighter shadow-[0_30px_80px_-10px_rgba(255,215,0,0.5),_0_-30px_80px_-10px_rgba(255,215,0,0.5)] mt-12 mb-6 cursor-pointer"
        >
          AI Powered career tool
        </motion.button>

        <motion.div className="text-center mb-6">
          {/* First line */}
          <div className="whitespace-nowrap">
            {title.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{
                  opacity: 0,
                  y: 80,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  delay: i * 0.03,
                  duration: 0.5,
                }}
                className="
          inline-block
          text-[30px]
          md:text-[60px]
          xl:text-[80px]
          font-bold
          leading-[1]
          tracking-tighter
        "
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* Second line */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1,
              duration: 0.8,
            }}
            className="
      text-[#1342ff]
      text-[30px]
      md:text-[60px]
      xl:text-[80px]
      font-bold
      leading-[1]
      tracking-tighter
    "
          >
            Hello Dreams AI
          </motion.div>
        </motion.div>
        <motion.p
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.2,
            duration: 0.7,
          }}
          className="w-full md:w-[696px] text-[16px] md:text-[20px] text-[#eaecf0] text-center"
        >
          Experience the future of career development. Our AI doesn't just help
          —it understands, adapts, and creates experiences so intuitive, you'll
          feel like you're touching tomorrow.
        </motion.p>
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 100,
          scale: 0.94,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          delay: 1.5,
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{
          y: -6,
        }}
        className="p-[1.5px] rounded-xl bg-gradient-to-r from-[#ffffffad] to-[#ffffff3d] shadow-[0_0_70px_40px_rgba(12,75,246,0.4)] mb-10"
      >
        <div className="w-full h-[240px] md:h-[480px] xl:h-[880px] bg-black rounded-xl p-2 md:px-5 md:py-8">
          <video
            className="w-full h-full rounded-xl md:rounded-3xl object-cover"
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
      </motion.div>
    </div>
  );
};

export default LandingHeader;
