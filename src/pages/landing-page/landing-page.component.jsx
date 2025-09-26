import React from "react";
import Navbar from "../../components/navbar/navbar.component";
import LandingHeader from "../../components/landing-header/landing-header.component";
import CareerBuildingSection from "../../components/career-building-section/career-building-section.component";
import ProfessionalPersonaSection from "../../components/career-building-section/professional-persona-section.component";
import ConnectAndShare from "../../components/connect-share-section/connect-share.component";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <LandingHeader />
      <CareerBuildingSection />
      <ProfessionalPersonaSection />
      <ConnectAndShare />
    </>
  );
};

export default LandingPage;
