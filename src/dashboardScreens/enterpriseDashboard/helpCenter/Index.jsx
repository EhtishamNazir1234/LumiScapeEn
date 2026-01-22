import React, { useState } from "react";
import FAQs from "./FAQs";
import Articles from "./Articles";
import TroubleShootingGuides from "./TroubleShootingGuides";
import Contact from "./Contact";
const Index = () => {
  const [activeTab, setActiveTab] = useState("faqs");

  return (
    <div className="space-y-4">
      <div className="flex flex-col w-full sm:flex-row justify-between whitespace-nowrap mb-5">
        <h1 className="font-vivita text-2xl font-medium">Help Center</h1>
      </div>
      <div className="w-full md:w-[80%] whitespace-nowrap grid grid-cols-2 md:flex p-2 rounded-xl md:gap-4 gap-x-10 gap-y-4 box-shadow">
        <button
          className={`flex-1 py-1 cursor-pointer rounded-lg box-shadow ${
            activeTab === "faqs" ? "bg-[#337FBA] text-white" : ""
          }`}
          onClick={() => setActiveTab("faqs")}
        >
          FAQs
        </button>
        <button
          className={`flex-1 py-1 cursor-pointer rounded-lg box-shadow ${
            activeTab === "articles" ? "bg-[#337FBA] text-white" : ""
          }`}
          onClick={() => setActiveTab("articles")}
        >
          Articles
        </button>
        <button
          className={`xl:w-[25%] sm:w-[35%] w-[135%] py-1 cursor-pointer rounded-lg box-shadow ${
            activeTab === "troubleshootingGuides"
              ? "bg-[#337FBA] text-white"
              : ""
          }`}
          onClick={() => setActiveTab("troubleshootingGuides")}
        >
          Troubleshooting Guides
        </button>
        <button
          className={`xl:w-[25%] sm:w-[35%] w-[80%] ml-8 md:ml-0 flex-1 py-1 cursor-pointer rounded-lg box-shadow ${
            activeTab === "contact" ? "bg-[#337FBA] text-white" : ""
          }`}
          onClick={() => setActiveTab("contact")}
        >
          Contact
        </button>
      </div>
      <div className="max-h-170 overflow-y-auto">
        {activeTab === "faqs" && <FAQs />}
        {activeTab === "articles" && <Articles />}
        {activeTab === "troubleshootingGuides" && <TroubleShootingGuides />}
        {activeTab === "contact" && <Contact/>}
      </div>
    </div>
  );
};

export default Index;
