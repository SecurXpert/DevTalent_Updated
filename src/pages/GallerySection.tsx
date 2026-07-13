import journery1 from "../assests/1.png";
import journery2 from "../assests/2.png";
import journery3 from "../assests/3.png";
import journery4 from "../assests/4.png";

interface GallerySectionProps { }

const GallerySection: React.FC<GallerySectionProps> = () => {
  const galleryImages = [
    { src: journery1, alt: "Start Registration" },
    { src: journery2, alt: "Experience platform features" },
    { src: journery3, alt: "Coding challenge interface" },
    { src: journery4, alt: "Get hired by top companies" },
  ];

  return (
    <section id="gallery" className="py-10 sm:py-16 md:py-20 lg:py-10 bg-white w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#33329C] mb-8 sm:mb-10 md:mb-12 lg:mb-12">
          Visual Journey
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
              style={{
                borderTopLeftRadius: "40px sm:60px md:80px",
                borderBottomRightRadius: "40px sm:60px md:80px",
                aspectRatio: "16/9",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                style={{
                  borderTopLeftRadius: "40px sm:60px md:80px",
                  borderBottomRightRadius: "40px sm:60px md:80px",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;