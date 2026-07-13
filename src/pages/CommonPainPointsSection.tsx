import bgImage from "../assests/bg-image1.png";

interface CommonPainPointsSectionProps { }

const CommonPainPointsSection: React.FC<CommonPainPointsSectionProps> = () => {
  const painPoints = [
    {
      title: "Time-Consuming Interviews",
      description:
        "Traditional interviews are lengthy and inefficient, leading to delays in hiring processes.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Subjective Evaluations",
      description:
        "Traditional interviews involve subjectivity and insufficient, leading to delays in hiring processes.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Scalability Issues",
      description:
        "Traditional interviews face scalability and inefficient, leading to delays in hiring processes.",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Lack of Technical Depth",
      description:
        "Traditional interviews lack technical depth and objectivity, leading to delays in hiring processes.",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
  ];

  return (
    <section
      id="pain-points"
      className="py-6 sm:py-16 md:py-6 relative w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #C0BFFF 0%, #DD69F1 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          filter: "blur(4px) brightness(1.02) contrast(1.02)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-[#33329C] mb-12 sm:mb-16 md:mb-14 lg:mb-14 mt-8 sm:mt-10 md:mt-4">
          Common Pain Points
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          {painPoints.map((p, i) => (
            <div key={i} className="flex justify-center">
              <div
                className="rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl w-full max-w-xs sm:max-w-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #0e0b2a 0%, #05061a 100%)",
                }}
              >
                <div
                  className="rounded-2xl sm:rounded-3xl overflow-hidden relative"
                  style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    className="relative h-32 sm:h-36 md:h-40 lg:h-44 w-full overflow-hidden rounded-t-2xl sm:rounded-t-3xl border-[6px] sm:border-[8px] border-transparent"
                    style={{
                      boxShadow:
                        "0 10px 30px rgba(16,8,64,0.45), inset 0 -20px 40px rgba(0,0,0,0.35)",
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      style={{ display: "block" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                  </div>

                  <div className="px-3 sm:px-4 md:px-5 pb-4 sm:pb-5 md:pb-6 pt-3 sm:pt-4 text-center relative">
                    <div
                      className="absolute inset-0 rounded-b-2xl sm:rounded-b-3xl"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.25) 100%)",
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      className="absolute inset-0 rounded-b-2xl sm:rounded-b-3xl"
                      style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: "180px sm:200px lg:220px",
                        backgroundPosition: "center bottom",
                        backgroundRepeat: "no-repeat",
                        opacity: 0.16,
                        mixBlendMode: "overlay",
                        pointerEvents: "none",
                      }}
                    />

                    <div className="relative text-white">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed max-w-[200px] sm:max-w-[220px] mx-auto">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommonPainPointsSection;