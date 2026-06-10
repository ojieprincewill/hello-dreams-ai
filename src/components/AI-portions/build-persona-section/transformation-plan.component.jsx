import React from "react";
import { ArrowRight } from "lucide-react";

const TransformationPlan = ({ onApply, onRestart, persona }) => {
  const transformData = persona?.transformationPlan || [
    {
      id: "speaking-style",
      title: "Speaking Style",
      actions: [
        "Use authoritative language and speak with measured confidence",
        "Pause strategically for emphasis and to command attention",
        "Make direct eye contact and use purposeful body language",
        "Keep communications concise and impactful",
      ],
    },
    {
      id: "dressing-for-impact",
      title: "Dressing for Impact",
      actions: [
        "Invest in executive-level wardrobe pieces that command respect",
        "Choose sophisticated, timeless styles that project gravitas",
        "Ensure perfect fit and impeccable grooming at all times",
        "Select accessories that enhance rather than distract from your presence",
      ],
    },
    {
      id: "workplace-behavior",
      title: "Workplace Behavior",
      actions: [
        "Enter rooms with confidence and greet others warmly but authoritatively",
        "Take up appropriate space in meetings and conversations",
        "Make decisions quickly and stand behind them confidently",
        "Handle pressure and difficult situations with calm composure",
      ],
    },
    {
      id: "meeting-mastery",
      title: "Meeting Mastery",
      actions: [
        "Arrive early and use the time to build relationships",
        "Speak with authority and back up statements with evidence",
        "Take charge when leadership is needed, but listen actively to others",
        "End meetings with clear action items and accountability",
      ],
    },
    {
      id: "digital-presence",
      title: "Digital Presence & Personal Brand",
      actions: [
        "Use professional photography that captures your executive presence",
        "Share perspectives on leadership, strategy, and industry direction",
        "Engage thoughtfully with senior leaders and industry influencers",
        "Position yourself as someone who shapes conversations, not just participates",
      ],
    },
  ];

  return (
    <div className="px-4 sm:px-[5%] py-6 md:py-10">
      {/* CARD */}
      <div className="bg-[#efefef] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="bg-gradient-to-r from-[#8a2be2] to-[#ff00e6] py-1 px-3 w-max rounded-2xl text-[12px] text-white font-bold mb-2">
          Your Transformation Playbook
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl mb-5">
          From the{" "}
          <span className="font-bold capitalize">
            {persona?.currentPersona?.title ||
              persona?.currentPersona ||
              "Reliable Executor"}
          </span>{" "}
          to the{" "}
          <span className="font-bold capitalize">
            {persona?.idealPersona?.title ||
              persona?.idealPersona ||
              "Executive Presence"}
          </span>
        </p>

        {/* GRID → STACK FIRST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transformData.map((data) => (
            <div
              key={data.id}
              className="border border-[#ccc] dark:border-[#494848] rounded-md p-3 sm:p-4"
            >
              <p className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                {data.title}
              </p>

              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base md:text-lg">
                {data.actions.map((action, actionIndex) => (
                  <li key={`${data.id}-${actionIndex}`}>{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col items-center mt-8 space-y-4">
        <button
          onClick={onApply}
          className="
            w-full sm:w-auto sm:min-w-[280px]
            px-6 py-3 sm:py-4
            text-base sm:text-lg md:text-xl
            font-bold text-white
            bg-gradient-to-b from-[#1342ff] to-[#ff00e6]
            rounded-xl
            tracking-tight
            disabled:opacity-60
          "
        >
          Apply this persona to my profile
          <ArrowRight size={20} className="inline ml-2" />
        </button>

        <button
          onClick={onRestart}
          className="
            w-full sm:w-auto sm:min-w-[280px]
            px-6 py-3 sm:py-4
            text-base sm:text-lg md:text-xl
            font-bold text-white
            bg-gradient-to-b from-[#748ffc] to-[#1342ff]
            rounded-xl
            tracking-tight
            disabled:opacity-60
          "
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default TransformationPlan;
