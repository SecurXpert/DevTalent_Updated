const SolutionsSection = () => {
  const solutions = [
    { image: "/img/Group 1.svg", title: "AI powered Assesments" },
    { image: "/img/Group 2.svg", title: "Scalable Platform" },
    { image: "/img/Group 3.svg", title: "Live Coding Challenges" },
    { image: " /img/Group 4.svg", title: "Data Driven Insights" },
  ];

  return (
    // ❌ overflow-hidden REMOVED from here
    <section
      id="solution"
      className="relative w-full bg-[#39319D] scroll-mt-40 md:scroll-mt-30 lg:scroll-mt-44"
    >
      {/* Man SVG */}
      <div
        className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2
md:-translate-y-[9.5rem]
lg:-translate-y-[11.3rem]
xl:-translate-y-[11.3rem]
2xl:-translate-y-[11.3rem]
z-10"
      >
        <img
          src="/img/man.svg"
          alt="Man leaning on section"
          className="w-40 sm:w-52 md:w-[22rem] lg:w-[26rem] max-w-full object-contain"
        />
      </div>

      {/* Inner content wrapper */}
      <div className="container px-4 sm:px-6 md:px-8 pt-16 sm:pt-40 md:pt-24 lg:pt-16 pb-4">
        {/* Heading */}
        {/* Heading — positioned near man's hands */}
        {/* Heading positioned under man's hand */}
        <h2
          className="
  absolute
  left-1/2
  top-[20px] xs:top-[10px] sm:top-[70px] md:top-[100px] lg:top-[110px]
  -translate-x-1/2
  text-2xl sm:text-3xl md:text-4xl
  font-semibold
  text-white
  z-20
"
        >
          Our Solutions
        </h2>

        {/* Decorative images */}
        <img
          src="/img/computer.svg"
          alt="Computer"
          className="
    hidden md:block 
    pointer-events-none 
    rotate-[-6deg]

    w-16 md:w-20 lg:w-[6rem]

    translate-x-6 md:translate-x-10 lg:translate-x-[10rem]
    -translate-y-1 md:-translate-y-2 lg:-translate-y-[1rem]
  "
        />

        <img
          src="/img/bigbulb.svg"
          alt="Bulb"
          className="
    hidden md:block
    pointer-events-none

    w-16 md:w-20 lg:w-[5rem]

    translate-x-20 md:translate-x-[40rem] lg:translate-x-[52rem] xl:translate-x-[63rem]
    -translate-y-6 md:-translate-y-24 lg:-translate-y-[6rem]
  "
        />

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-stretch">
          {solutions.map((solution, index) => (
            <div key={index} className="relative group">
              <div
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
p-6 md:p-8 text-center border-2 border-purple-100 hover:border-purple-300 
h-full flex flex-col"
              >
                {/* ICON AREA (fixed height — alignment key) */}
                <div className="h-[80px] flex items-center justify-center mb-4">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center 
    group-hover:scale-110 transition-transform duration-300"
                  >
                    <img
                      src={solution.image}
                      alt={solution.title}
                      className="w-10 h-10 md:w-16 md:h-16 object-contain"
                    />
                  </div>
                </div>

                {/* TITLE AREA */}
                <div className="flex-1 flex items-start justify-center">
                  <h3 className="text-base md:text-xl font-bold text-[#33329C]">
                    {solution.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}

          {/* Small bulb */}
          <img
            src="/img/smlbulb.svg"
            alt="Small bulb"
            className="
    hidden md:block 
    pointer-events-none

    w-8 md:w-10 lg:w-[3.3rem]

    -translate-x-4 md:-translate-x-6 lg:-translate-x-6
    -translate-y-1 md:-translate-y-2 lg:-translate-y-2
  "
          />
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
