import React, { useState, useEffect } from "react";

const ConnectAndShare = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true);
    }, 5000);

    if (isSliding) {
      const timeout = setTimeout(() => {
        setCurrentCardIndex((prev) => (prev + 1) % cards.length);
        setIsSliding(false);
      }, 600);

      return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
  }, [isSliding, cards.length]);

  return (
    <div className="py-10">
      <style jsx>{`
        @keyframes slideInFromBottomRight {
          0% {
            transform: translateX(128px) translateY(128px) scale(0.75);
            opacity: 0;
          }
          100% {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 1;
          }
        }
        .slide-in-animation {
          animation: slideInFromBottomRight 0.6s ease-out forwards;
        }
      `}</style>

      <div className="px-[5%] mb-15">
        <p className="text-[64px] font-bold tracking-tighter">
          Connect & Share
        </p>
        <p className="w-[593px] text-[#eaecf0] text-[20px]">
          Join our community and share your career aspirations. Feel supported
          from the very first click.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-[900px] ">
        {/* Left Side - Featured Card Display */}
        <div
          aria-live="polite"
          className="relative h-full border-t-[1.5px] border-[#a554f1] shadow-[0_-10px_20px_-5px_rgba(165,84,241,0.6),_10px_0_20px_-5px_rgba(165,84,241,0.6)] bg-black flex items-center justify-center p-6  overflow-hidden "
        >
          {/* Featured Card with slide-in animation from bottom-right */}
          <div
            key={currentCardIndex}
            className={`max-w-[508px] h-auto md:h-[508px] rounded-3xl p-8 flex items-center justify-center text-center slide-in-animation ${cards[currentCardIndex].gradient}`}
          >
            <p
              className={`text-[24px] font-semibold leading-relaxed ${cards[currentCardIndex].textColor}`}
            >
              {cards[currentCardIndex].text}
            </p>
          </div>
        </div>

        {/* Right Side - Overlapping Card Stack */}
        <div
          className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-700 border-l-[1.5px] border-b-[1.5px] border-[#a554f1] shadow-[0_10px_40px_-10px_rgba(165,84,241,0.6)]
 overflow-hidden"
        >
          <div className="relative w-[508px]">
            {cards.map((card, index) => {
              const totalStackHeight = (cards.length - 1) * 80 + 120; // Total height of the stack
              const centerOffset = -totalStackHeight / 2; // Offset to center the stack

              // Calculate how many positions this card is from the current prominent card
              const positionFromCurrent =
                (index - currentCardIndex + cards.length) % cards.length;

              // Position 0 = prominent card (bottom of stack)
              // Position 1 = next card (second from bottom)
              // Position 6 = card at back (top of stack)
              const stackPosition = cards.length - 1 - positionFromCurrent;

              const isMovingToBack = isSliding && index === currentCardIndex;

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    setIsSliding(true);
                    setTimeout(() => {
                      setCurrentCardIndex(index);
                      setIsSliding(false);
                    }, 600);
                  }}
                  className={`absolute w-full h-[120px] rounded-xl p-4 flex items-center justify-center text-center transition-all duration-600 ${card.gradient}`}
                  style={{
                    top: `${centerOffset + stackPosition * 80}px`,
                    zIndex: isMovingToBack ? 0 : stackPosition + 1, // Moving card goes to back
                  }}
                >
                  <p
                    className={`text-sm font-medium leading-relaxed ${card.textColor}`}
                  >
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectAndShare;
