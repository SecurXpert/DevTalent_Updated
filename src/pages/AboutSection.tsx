import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const navigate = useNavigate(); // ✅ add this

  return (
    <section id="about-us" className="pt-20 pb-10 bg-white">
      <div className="container mx-auto px-6">
        {/* First Section - Normal Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left side - Content */}
          <div className="space-y-6">
            <h2 className="font-inter text-3xl md:text-4xl lg:text-[3.5rem] font-bold text-[#6F24A6]">
              About US
            </h2>
            <h3 className="font-inter font-semibold text-[1.5rem] md:text-[2rem] lg:text-[2.666rem] leading-tight md:leading-snug lg:leading-[3.865rem] text-[#111] capitalize lg:w-[35rem]">
              Empowering Smarter Hiring Through Skill-First Assessments
            </h3>
            <p className="text-[1rem] text-[#4B5563] leading-relaxed max-w-2xl">
              DevTalent is transforming how organizations discover, evaluate and
              hire technical talent. Our AI-powered platform streamlines
              interviews, coding assessments and workforce evaluation, enabling
              recruiters, educational institutions and enterprises to make
              faster, data-driven and unbiased hiring decisions.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-[0.666rem] px-[1.333rem] py-[1.066rem] w-[8.48rem] h-[3.47rem] text-white rounded-[0.533rem] bg-gradient-to-b from-[#6F24A6] to-[#3D309E]"
            >
              Join Us <span className="text-xl">→</span>
            </button>
          </div>

          {/* Right side - Images */}

          <div className="relative flex justify-center items-center">
            {/* BACKGROUND CARD (behind both images) */}
            <div className="relative bg-[#F2F2F2] rounded-[1rem] w-[20rem] h-[18rem] lg:w-[31.58rem] lg:h-[28rem]">
              {/* TOP IMAGE */}
              <img
                src="/img/Rectangle 14.svg"
                alt="Team Work"
                className="absolute
                 w-[16rem] h-[10rem] left-[10%] top-[-1rem]
                 lg:w-[25rem] lg:h-[16rem] lg:left-[28%] lg:top-[-2rem]
                 object-cover rounded-[0.666rem] shadow-xl"
              />

              {/* BOTTOM IMAGE */}
              <img
                src="/img/Rectangle 13.svg"
                alt="Class Room"
                className="absolute bottom-[-2rem] left-[-1rem]
                 w-[16rem] h-[10rem]
                 lg:-bottom-[3.5rem] lg:-left-20
                 lg:w-[25rem] lg:h-[16rem]
                 object-cover rounded-[0.666rem] shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
