import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "lucide-react";
import img1 from "../../assests/img1.png";

interface HeroSectionProps {
  onLoginClick: () => void;
}

const HeroSection = ({ onLoginClick }: HeroSectionProps) => {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative  flex items-center overflow-hidden py-8"
    >
      {/* Top right gradient shade */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-gradient-to-br from-white via-white to-transparent rounded-bl-full blur-3xl pointer-events-none" />

      {/* Bottom left gradient shade */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[350px] bg-gradient-to-tr from-purple-200 via-white to-transparent rounded-tr-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-10 lg:py-0 mb-0">
        <div className="space-y-4 z-20">
          <h1
            className="font-inter font-bold text-3xl md:text-4xl lg:text-[4rem] leading-tight md:leading-snug lg:leading-[5.125rem] tracking-[-0.03125rem] capitalize text-gray-900 w-full md:w-[30rem] lg:w-[38rem]"
            style={{ marginTop: "0px !important" }}
          >
            <span className="text-6xl">
              The Most Advanced Next-Gen{" "}
              <span className="text-[#961BAC]">Interview Assessments </span>{" "}
              <br /> Platform
            </span>
            <br />
          </h1>
          <p className="font-inter font-normal text-base md:text-[1rem] leading-[1.8] text-gray-700 w-full md:w-[25rem] lg:w-[30rem]">
            Empowering Recruiters And Students With AI-Driven Hiring, Real-Time
            Coding Tests And Skill-Based Insights
          </p>
          <Button
            onClick={() => {
              console.log("clicked");
              navigate("/login");
            }}
            className="bg-gradient-to-r from-[#961BAC] to-[#33329C] hover:from-[#961BAC]/90 hover:to-[#33329C]/90 text-white font-bold text-xl py-7 px-12 rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 "
          >
            Start Your Journey <ArrowRight className="ml-4 w-7 h-7" />
          </Button>
        </div>
        <div className="relative pointer-events-none">
          {/* Ellipse background */}
          <div
            className="absolute inset-0 z-0 flex items-center justify-center"
            style={{}}
          />
          {/* Women image on top */}
          <img
            src="/img/hstdimg.svg"
            alt="Students"
            className="relative z-0 w-30 max-w-2xl mt-10 drop-shadow-2xl h-200"
            style={{
              maxWidth: "110%",
              maxHeight: "45%",
              display: "block",
              margin: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
