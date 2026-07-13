import { Globe, Brain } from "lucide-react";

const ImpactSection = () => {
  return (
    <section id="impact" className="min-h-[500px] py-8 lg:py-1 mb-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-6 w-full max-w-md mx-auto lg:mx-0 lg:ml-16">
            <h2 className="font-['Inter'] text-3xl md:text-[3rem] font-bold text-[#6F24A6]">
              Our Impact
            </h2>
            <p className="text-[1rem] text-[#4B5563] leading-relaxed max-w-2xl">
              DevTalent bridges the gap between learning and hiring, empowering
              students, educators and recruiters worldwide with skill-first
              assessments and data-driven hiring insights.
            </p>
          </div>

          {/* Right side - Three Images Layout */}
          <div className="relative">
            <div className="w-full flex flex-col items-center space-y-4 mb-2 md:translate-x-[-5rem]">
              {/* Top image - centered */}
              <img
                src="/img/student3.svg"
                alt="Student 1"
                className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[500px] 
               h-[220px] sm:h-[260px] md:h-[350px] lg:h-[400px] 
               object-contain rounded-full mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
