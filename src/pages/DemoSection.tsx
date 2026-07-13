interface DemoSectionProps {}

const DemoSection: React.FC<DemoSectionProps> = () => {
  return (
    <section
      id="demo"
      className="py-16 sm:py-20 md:py-12 bg-gradient-to-b from-purple-100 to-purple-50 w-full overflow-x-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#33329C] mb-6 sm:mb-8 md:mb-10">
          Watch Our Demo
        </h2>
        <div className="max-w-4xl sm:max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden relative">
          <video
            className="w-full aspect-video"
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/placeholder.svg"
          >
            <source src="/videos/dev talent 3.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
