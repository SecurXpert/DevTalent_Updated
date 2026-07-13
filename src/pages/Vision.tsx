import { Globe, Brain } from "lucide-react";
import { Container, Row, Col } from "react-bootstrap";
import about1 from "../../assests/about1.png";
import about2 from "../../assests/about2.png";
import about3 from "../../assests/about3.png";
import about4 from "../../assests/about4.png";

const Vision = () => {
  return (
    <section id="vision" className=" pb-10 bg-white">
      <div className="container mx-auto px-6">
        {/* Second Section - Reversed Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-center pt-[5rem]">
          {/* Right side - Images */}
          <div className="relative">
            <div className=" gap-2 from-purple-50 to-purple-100 rounded-3xl">
              <div className="col-start-2">
                <img
                  className="w-[18rem] h-[20rem] object-contain mx-auto lg:w-auto lg:h-[25rem] lg:ml-[-0.1rem]"
                  src="/img/Images.svg"
                  alt=""
                />
              </div>
            </div>
          </div>

          {/* Left side - Content */}
          <div className="max-w-2xl space-y-6">
            <h2 className="font-['Inter'] text-3xl md:text-4xl lg:text-[3.5rem] font-bold text-[#6F24A6]">
              Our Vision
            </h2>
            <p className="text-[1rem] text-[#4B5563] leading-relaxed max-w-2xl">
              Our vision is to redefine the future of talent evaluation by
              making hiring skill-first, intelligent and unbiased. We aim to
              empower students, developers, recruiters and organizations with
              advanced AI-driven tools that simplify hiring, improve
              decision-making and unlock equal opportunities for all.
            </p>
            <p className="text-[1rem] text-[#4B5563] leading-relaxed max-w-2xl">
              By combining real-time assessments, data-driven insights and
              scalable workforce solutions, DevTalent strives to build a global
              ecosystem where talent is recognized by skills not background
              enabling organizations to hire smarter and individuals to grow
              faster.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
