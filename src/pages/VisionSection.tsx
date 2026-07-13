interface VisionSectionProps { }

const VisionSection: React.FC<VisionSectionProps> = () => {
  return (
    <section id="vision" className="py-4 sm:py-16 md:py-8 bg-purple-100 w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#33329C] mb-6 sm:mb-8 md:mb-10 mt-4 sm:mt-10 md:mt-2">
          Our Vision
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl sm:max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
          To build the most intelligent hiring ecosystem that connects talent
          and opportunity through skill-based assessments and innovation —
          making the hiring process simpler, faster, and smarter.
        </p>
      </div>
    </section>
  );
};

export default VisionSection;