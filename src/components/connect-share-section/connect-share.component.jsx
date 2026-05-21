import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const ConnectAndShare = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  const cards = [
    {
      id: 1,
      text: "I am worthy of every opportunity that aligns with my dreams.",
      gradient:
        "bg-gradient-to-br from-purple-500 via-purple-400 to-violet-300",
      textColor: "text-white",
    },
    {
      id: 2,
      text: "My unique skills and experiences make me an invaluable asset to any team.",
      gradient: "bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-300",
      textColor: "text-white",
    },
    {
      id: 3,
      text: "Every challenge I face is an opportunity to grow and showcase my resilience.",
      gradient:
        "bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400",
      textColor: "text-white",
    },
    {
      id: 4,
      text: "I attract opportunities that align with my passion and purpose.",
      gradient: "bg-gradient-to-br from-pink-500 via-rose-400 to-pink-300",
      textColor: "text-white",
    },
    {
      id: 5,
      text: "My career journey is unfolding perfectly, bringing me closer to my dreams.",
      gradient: "bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-400",
      textColor: "text-gray-900",
    },
    {
      id: 6,
      text: "I have the confidence and skills to excel in any professional environment.",
      gradient: "bg-gradient-to-br from-yellow-200 via-amber-100 to-yellow-300",
      textColor: "text-gray-900",
    },
    {
      id: 7,
      text: "Success flows to me naturally as I align my actions with my highest vision.",
      gradient: "bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-500",
      textColor: "text-white",
    },
  ];

  // autoplay (feels more “alive”)
  useEffect(() => {
    const t = setInterval(() => {
      setDirection("next");
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }, 5000);

    return () => clearInterval(t);
  }, [cards.length]);

  const getCardStyle = (index) => {
    const total = cards.length;
    let diff = index - currentCardIndex;

    // wrap-around correction
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const abs = Math.abs(diff);

    // core "alive stack" physics
    const translateY = direction === "next" ? diff * 18 : diff * -18; // stack spacing
    const scale = 1 - abs * 0.06;
    const rotate = diff * -2;
    const opacity = 1 - abs * 0.25;
    const blur = abs * 1.5;

    return {
      transform: `
        translateY(${translateY}px)
        scale(${scale})
        rotate(${rotate}deg)
      `,
      opacity,
      filter: `blur(${blur}px)`,
      zIndex: 100 - abs,
      transition:
        "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease",
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="py-10 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="px-[5%] mb-15"
      >
        <p className="text-[30px] md:text-[50px] xl:text-[64px] font-bold tracking-tighter">
          Connect & Share
        </p>
        <p className="md:w-[593px] text-[#eaecf0] text-[16px] md:text-[20px]">
          Join our community and share your career aspirations. Feel supported
          from the very first click.
        </p>
      </motion.div>

      {/* RESPONSIVE: stack on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[700px]"
      >
        {/* LEFT - ACTIVE CARD (focused stage) */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative isolate flex items-center justify-center bg-black overflow-hidden p-6 md:border-t-[1.5px] md:border-[#a554f1] md:shadow-[0_-10px_20px_-5px_rgba(165,84,241,0.6),_10px_0_20px_-5px_rgba(165,84,241,0.6)]"
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => {
                setDirection("next");
                setCurrentCardIndex(index);
              }}
              className={`absolute w-[85%] md:w-[70%] h-[380px] rounded-3xl p-8 flex items-center justify-center text-center cursor-pointer ${card.gradient}`}
              style={getCardStyle(index)}
            >
              <p
                className={`text-[20px] md:text-[24px] font-semibold ${card.textColor}`}
              >
                {card.text}
              </p>
            </div>
          ))}
        </motion.div>

        {/* RIGHT - PREVIEW STRIP (simple + clean) */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="hidden md:flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-700 p-6 md:border-l-[1.5px] md:border-b-[1.5px] md:border-[#a554f1] md:shadow-[0_10px_40px_-10px_rgba(165,84,241,0.6)]"
        >
          <div className="space-y-3 w-[80%]">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => setCurrentCardIndex(index)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${card.gradient} ${
                  index === currentCardIndex
                    ? "ring-2 ring-white"
                    : "opacity-60 hover:opacity-90"
                }`}
              >
                <p className={`text-sm ${card.textColor}`}>
                  {card.text.slice(0, 60)}...
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ConnectAndShare;
