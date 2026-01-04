import React from "react";
import { ArrowRight } from "lucide-react";

const transformData = [
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

const TransformationPlan = () => {
  return (
    <div className="min-h-screen px-[5%] py-10 ">
      <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-6 md:p-10 ">
        <div className="bg-gradient-to-r from-[#8a2be2] to-[#ff00e6] py-1 px-2 w-max rounded-2xl text-[12px] font-bold mb-1 ">
          Your Transformation Playbook
        </div>
        <p className="text-[18px] md:text-[24px] mb-5 ">
          From the{" "}
          <span className="font-bold capitalize">reliable executor</span> to the{" "}
          <span className="font-bold capitalize">executive presence</span>
        </p>
        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
          {transformData.map((data, index) => (
            <div
              key={data.id}
              className={`border border-[#494848] rounded-md p-2 ${
                index === transformData.length - 1 ? "col-span-2" : ""
              }`}
            >
              <p className="text-[18px] md:text-[24px] font-bold capitalize mb-1 ">
                {data.title}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[16px] md:text-[20px]">
                {data.actions.map((action) => (
                  <li className="marker:text-sm">{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center mt-8">
        <button
          className="w-[476px] text-center py-3 border border-[#eaecf0] bg-gradient-to-b from-[#1342ff] to-[#ff00e6] text-[#fff] text-[24px] font-bold rounded-xl tracking-tighter disabled:opacity-60 cursor-pointer"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Apply this persona to my profile
          <span>
            <ArrowRight size={24} strokeWidth={2.5} className="inline ml-2" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default TransformationPlan;
