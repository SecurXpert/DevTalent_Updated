import { useState } from "react";
import {
  Star,
  Heart,
  Cloud,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import icon from '../assests/icon.png'; // <-- update to your correct logo path
import { ImageWithFallback } from "./ImageWithFallback";
import Landing from "./Landing";



/* ============================================================
   HEADER SECTION (ADDED)
   ============================================================ */

function Header({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  setIsLoginOpen,
  setIsContactOpen,
  setIsAdminLoginOpen
}) {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <img src={icon} alt="DevTalent Logo" className="w-32 h-10 object-contain" />
        </div>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { href: "/", label: "Home" },
            { href: "#about", label: "About Us" },
            { href: "#vision", label: "Vision" },
            { href: "#pain-points", label: "Pain Points" },
            { href: "/gallery", label: "Gallery" },
            { href: "#demo", label: "Demo" }
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-black hover:text-blue-300 text-sm font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* RIGHT BUTTONS */}
        <div className="hidden md:flex items-center space-x-4 mr-8">

          <Button
            onClick={() => setIsLoginOpen(true)}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
          >
            Login
          </Button>

          <button
            onClick={() => setIsContactOpen(true)}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
          >
            Contact Us
          </button>

          <button
            onClick={() => setIsAdminLoginOpen(true)}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
          >
            Admin Login
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/40 backdrop-blur-md text-white px-4 py-4 space-y-4">
          {[
            { href: "#home", label: "Home" },
            { href: "#about", label: "About Us" },
            { href: "#vision", label: "Vision" },
            { href: "#pain-points", label: "Pain Points" },
            { href: "/gallery", label: "Gallery" },
            { href: "#demo", label: "Demo" }
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-white text-sm"
            >
              {item.label}
            </a>
          ))}

          <Button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsLoginOpen(true);
            }}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md"
          >
            Login
          </Button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsContactOpen(true);
            }}
            className="w-full border border-white text-white rounded-md py-2"
          >
            Contact Us
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsAdminLoginOpen(true);
            }}
            className="w-full text-white text-sm"
          >
            Admin Login
          </button>
        </div>
      )}
    </header>
  );
}

/* ============================================================
   DECORATION ELEMENTS
   ============================================================ */

export function DecoElements() {
  return (
    <>
      <Star className="absolute top-20 left-10 w-6 h-6 text-yellow-400 animate-pulse" fill="currentColor" />
      <Star className="absolute top-40 right-20 w-4 h-4 text-yellow-300 animate-bounce" fill="currentColor" />
      <Star className="absolute bottom-40 left-16 w-5 h-5 text-yellow-500 animate-pulse delay-300" fill="currentColor" />

      <Heart className="absolute top-32 right-40 w-5 h-5 text-pink-400 animate-bounce delay-100" fill="currentColor" />
      <Heart className="absolute bottom-60 right-10 w-4 h-4 text-pink-300 animate-pulse delay-500" fill="currentColor" />

      <Cloud className="absolute top-16 left-1/3 w-8 h-8 text-blue-200 animate-float" fill="currentColor" />
      <Cloud className="absolute bottom-20 right-1/3 w-6 h-6 text-blue-300 animate-float delay-700" fill="currentColor" />

      <Sparkles className="absolute top-60 left-20 w-5 h-5 text-purple-400 animate-pulse delay-200" fill="currentColor" />
      <Sparkles className="absolute bottom-80 right-60 w-4 h-4 text-purple-300 animate-bounce delay-400" fill="currentColor" />

      <div className="absolute top-24 left-1/4 w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-600" />
      <div className="absolute top-80 right-1/4 w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-800" />
      <div className="absolute bottom-32 left-1/2 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-1000" />

      <div className="absolute top-12 right-1/4 w-4 h-5 bg-red-400 rounded-full animate-float" />
      <div className="absolute top-72 left-1/4 w-5 h-6 bg-blue-400 rounded-full animate-float delay-300" />
      <div className="absolute bottom-24 left-1/3 w-4 h-5 bg-green-400 rounded-full animate-float delay-600" />
    </>
  );
}

/* ============================================================
   PHOTO ALBUM CARD
   ============================================================ */

interface PhotoAlbumCardProps {
  title: string;
  coverImage: string;
  color: string;
  onClick: () => void;
}

export function PhotoAlbumCard({ title, coverImage, color, onClick }: PhotoAlbumCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:rotate-1 ${
        isHovered ? "z-10" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className="relative w-full h-80 rounded-3xl shadow-xl overflow-hidden p-1"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
      >
        <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-inner">
          <ImageWithFallback
            src={coverImage}
            alt={title}
            className="w-full h-4/5 object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-white flex items-center justify-center">
            <h3 className="font-['Baloo'] text-lg font-semibold text-gray-800 text-center px-4">
              {title}
            </h3>
          </div>

          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-yellow-200 opacity-80 rounded-sm shadow-sm rotate-2" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INSTAGRAM CARD
   ============================================================ */

interface InstaPost {
  image: string;
  caption: string;
}

export function InstagramCardBox({ image, caption }: InstaPost) {
  return (
    <div
      className="relative bg-white p-4 pb-16 rounded-3xl shadow-xl hover:shadow-2xl 
      transition-all duration-300 transform hover:scale-[1.03] 
      flex flex-col h-[420px]"
    >
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-5 bg-yellow-300/80 rounded-sm shadow-sm rotate-2" />

      <ImageWithFallback
        src={image}
        alt={caption}
        className="w-full h-48 object-cover rounded-xl"
      />

      <p className="mt-3 text-gray-700 font-['Inter'] text-sm flex-grow">
        {caption}
      </p>

      <div className="absolute bottom-4 right-4">
        <div className="w-7 h-7 bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-lg relative">
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ALBUM SECTION
   ============================================================ */

export function AlbumSection() {
  const albums = [
    {
      title: "Adventure Day",
      coverImage: "https://placehold.co/600x800/000/FFF?text=Adventure",
      color: "#3E66F3",
    },
    {
      title: "Office Olympics",
      coverImage: "https://placehold.co/600x800/DDD/000?text=Office",
      color: "#3E66F3",
    },
    {
      title: "Team Treasure Hunt",
      coverImage: "https://placehold.co/600x800/BBB/000?text=Treasure",
      color: "#3E66F3",
    },
    {
      title: "Paint & Play",
      coverImage: "https://placehold.co/600x800/EEE/000?text=Paint",
      color: "#3E66F3",
    },
    {
      title: "Wellness Escape",
      coverImage: "https://placehold.co/600x800/CCC/000?text=Wellness",
      color: "#3E66F3",
    },
  ];

  return (
    <div className="px-10 py-20 relative">
      <DecoElements />

      <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl ml-20 pl-5 font-black text-black leading-tight tracking-tight text-center">
        The Memories
      </h2>

      <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto text-center">
        Relive our amazing adventures and see what makes SideQuest such a special
        place to work and play! 🎉
      </p>

      <h3 className="text-3xl font-bold mt-16 font-['Baloo'] text-center">
        Our <span className="text-#3E66F3">Adventure</span> Albums
      </h3>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 relative z-10">
        {albums.map((a, i) => (
          <PhotoAlbumCard
            key={i}
            title={a.title}
            coverImage={a.coverImage}
            color={a.color}
            onClick={() => console.log(a.title)}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   INSTAGRAM SECTION
   ============================================================ */

export function InstagramSection() {
  const instagramPosts: InstaPost[] = [
    {
      image: "https://placehold.co/600x400/FF00FF/FFF?text=Instagram+1",
      caption: "Another amazing day at the office! ✨ #SideQuest #TeamLife",
    },
    {
      image: "https://placehold.co/600x400?text=Workshop",
      caption: "Creative minds at work! 🎨 #CreativityUnleashed",
    },
    {
      image: "https://placehold.co/600x400?text=Lunch",
      caption: "Team lunch vibes! 🍽️ #FoodieTeam",
    },
    {
      image: "https://placehold.co/600x400?text=Squad",
      caption: "Squad goals! 🎉 #DreamTeam",
    },
    {
      image: "https://placehold.co/600x400?text=Team",
      caption: "Celebrating our wins! 🏆 #Victory #SideQuest",
    },
    {
      image: "https://placehold.co/600x400?text=Motivation",
      caption: "Monday motivation! 💪 #MondayMotivation",
    },
  ];

  return (
    <div className="px-10 mt-24 pb-20 relative">
      <DecoElements />

      <h2 className="text-5xl font-bold font-['Baloo']  text-center">
        Live from our <span className="text-#3E66F3">Instagram</span>
      </h2>

      <p className="text-gray-600 mt-3 text-center">
        Follow our daily adventures and behind-the-scenes moments! 📸
      </p>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {instagramPosts.map((post, i) => (
          <InstagramCardBox key={i} image={post.image} caption={post.caption} />
        ))}
      </div>
      
    </div>
    
  );
}

/* ============================================================
   FULL PAGE EXPORT
   ============================================================ */

export default function FullPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col">

      {/* HEADER INCLUDED */}
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setIsLoginOpen={setIsLoginOpen}
        setIsContactOpen={setIsContactOpen}
        setIsAdminLoginOpen={setIsAdminLoginOpen}
      />

      {/* MAIN PAGE CONTENT */}
      <div className="flex-grow">
        <DecoElements />
        <AlbumSection />
        <InstagramSection />
      </div>

      {/* STICKY FOOTER */}
      {/* <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-6 px-4 relative overflow-hidden animate-section-reveal">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-radial-pulse" />

        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-6 animate-stagger-enhanced">

            <div className="animate-fade-in-up stagger-item">
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#210A4A] to-[#3E66F3] bg-clip-text text-transparent animate-wave">
                DevTalent
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                The world's most advanced interview assessment platform.
              </p>
            </div>

            <div className="animate-fade-in-up stagger-item" style={{ animationDelay: "0.1s" }}>
              <h4 className="font-semibold mb-3 text-gray-300 text-sm">Company</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors hover:animate-pulse">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:animate-pulse">Contact</a></li>
              </ul>
            </div>

            <div className="animate-fade-in-up stagger-item" style={{ animationDelay: "0.2s" }}>
              <h4 className="font-semibold mb-3 text-gray-300 text-sm">Legal</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors hover:animate-pulse">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:animate-pulse">Terms of Service</a></li>
              </ul>
            </div>

            <div className="animate-fade-in-up stagger-item" style={{ animationDelay: "0.3s" }}>
              <h4 className="font-semibold mb-3 text-gray-300 text-sm">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:animate-bounce text-lg">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:animate-bounce text-lg">LinkedIn</a>
              </div>
            </div>

          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <p>&copy; 2025 DevTalent Exam Platform. All rights reserved.</p>
          </div>

        </div>
      </footer> */}


      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-12 px-4 relative overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-30" />
  <div className="container mx-auto relative z-10">
    <div className="grid md:grid-cols-4 gap-10 mb-10">

      {/* Logo */}
      <div>
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#210A4A] to-[#3E66F3] bg-clip-text text-transparent">
          DevTalent
        </h3>
        <p className="text-gray-400 text-sm">
          The world's most advanced AI-powered interview & assessment platform.
        </p>
      </div>

      {/* Company Links */}
      <div>
        <h4 className="font-semibold text-lg mb-5 text-gray-200">Company</h4>
        <ul className="space-y-4 text-gray-400">
         <li>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                 window.location.href = "/";
                // window.scrollTo({
                //   top: 0,
                //   behavior: "smooth"
                // });
              }}
              className="hover:text-white transition-all duration-300 inline-flex items-center gap-2 group cursor-pointer"
            >
              Home
              {/* <ArrowUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" /> */}
            </a>
          </li>


          <li>
            <button
              onClick={() => setIsContactOpen(true)}
              className="hover:text-white transition-all duration-300 text-left"
            >
              Contact Us
            </button>
          </li>
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h4 className="font-semibold text-lg mb-5 text-gray-200">Legal</h4>
        <ul className="space-y-4 text-gray-400">
          <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
          <li><a href="/condition" className="hover:text-white transition">Terms of Service</a></li>
        </ul>
      </div>

      {/* Social */}
      <div>
        <h4 className="font-semibold text-lg mb-5 text-gray-200">Follow Us</h4>
        <div className="flex gap-5">
          <a href="https://www.linkedin.com/company/securxpert-technologies-pvt-ltd/" className="hover:text-white hover:scale-125 transition">LinkedIn</a>
          <a href="https://www.instagram.com/securxpert/profilecard/?igsh=eGNnNnloajlyZmI1" className="hover:text-white hover:scale-125 transition">Instagram</a>
        </div>
      </div>

    </div>

    <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
      <p>&copy; 2025 DevTalent Exam Platform. All rights reserved.</p>
    </div>
  </div>
</footer>

    </div>
  );
}

