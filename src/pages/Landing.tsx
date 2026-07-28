import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import about from "../assests/About Us.png";
import techlogo from "../assests/techlogo.png";
import icon from "../assests/icon.png";
import Devlogo from "../assests/Devlogo.png";
import ContactUsSection from "./ContactUsSection";
import Footer from "../components/Footer";
import Vision from "./Vision";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Menu, X, Globe, Brain, User } from "lucide-react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import VisionSection from "./VisionSection";
import CommonPainPointsSection from "./CommonPainPointsSection";
import SolutionsSection from "./SolutionsSection";
import GallerySection from "./GallerySection";
import DemoSection from "./DemoSection";
import { ChevronDown } from "lucide-react";
import ImpactSection from "./ImpactSection";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    collegePasskey: "",
    collegeName: "",
  });
  const [adminLoginData, setAdminLoginData] = useState({
    email: "",
    password: "",
  });
  const [contactType, setContactType] = useState("");
  const [contactData, setContactData] = useState({});
  const [colleges, setColleges] = useState([]);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showCollegePasskey, setShowCollegePasskey] = useState(false);

  const [contactErrors, setContactErrors] = useState({});

  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(
          "https://api.devtalent.securxperts.com:8000/admin/colleges",
        );
        if (response.ok) {
          const data = await response.json();
          setColleges(data);
        }
      } catch (error) {
        console.error("Network error fetching colleges:", error);
      }
    };
    fetchColleges();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) &&
        (!mobileDropdownRef.current || !mobileDropdownRef.current.contains(event.target as Node))
      ) {
        setIsLoginDropdownOpen(false);
        setIsAdminDropdownOpen(false);
        setIsRegisterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !loginData.email ||
      !loginData.password ||
      !loginData.collegeName ||
      !loginData.collegePasskey
    ) {
      toast.error("Invalid credentials. Please fill all required fields.");
      return;
    }
    const selectedCollege = colleges.find(
      (c) => c.name === loginData.collegeName,
    );
    if (selectedCollege) {
      const isExpired =
        new Date(selectedCollege.passkey_expires_at) < new Date();
      if (isExpired) {
        toast.error("This college is inactive. Contact admin.");
        return;
      }
    }
    try {
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
            college_name: loginData.collegeName,
            college_passkey: loginData.collegePasskey,
          }),
        },
      );
      if (response.ok) {
        localStorage.clear();
        const data = await response.json();
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", loginData.email);
        localStorage.setItem("userCollege", loginData.collegeName);
        localStorage.setItem("userToken", data.access_token);
        toast.success("Login successful!");
        setIsLoginOpen(false);
        setLoginData({
          email: "",
          password: "",
          collegePasskey: "",
          collegeName: "",
        });
        navigate("/terms");
      } else {
        toast.error(
          "Invalid credentials. Please check your email or password.",
        );
      }
    } catch (error) {
      toast.error("Network error. Please try again later.");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminLoginData.email || !adminLoginData.password) {
      toast.error("Invalid credentials. Please fill all required fields.");
      return;
    }
    try {
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/auth/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: adminLoginData.email,
            password: adminLoginData.password,
          }),
        },
      );
      if (response.ok) {
        localStorage.clear();
        const data = await response.json();
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("adminEmail", adminLoginData.email);
        localStorage.setItem("adminToken", data.access_token);
        toast.success("Admin login successful!");
        setIsAdminLoginOpen(false);
        setAdminLoginData({ email: "", password: "" });
        navigate("/dashboard");
      } else {
        toast.error(
          "Invalid credentials. Please check your email or password.",
        );
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const validateContactForm = () => {
    const errors = {};

    const email = (contactData.email || "").trim();
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email =
        "Please enter a valid email address (e.g., name@example.com)";
    }

    if (contactType === "student") {
      const name = (contactData.name || "").trim();
      if (!name) {
        errors.name = "Name is required";
      } else if (name.length > 50) {
        errors.name = "Name must not exceed 50 characters";
      } else if (!/^[A-Za-z\s]+$/.test(name)) {
        errors.name =
          "Name should contain only letters and spaces (no numbers)";
      }

      const qualification = (contactData.qualification || "").trim();
      if (!qualification) {
        errors.qualification = "Qualification is required";
      } else if (qualification.length > 30) {
        errors.qualification = "Qualification must not exceed 30 characters";
      }

      const year = (contactData.passedout_year || "").trim();
      const currentYear = new Date().getFullYear();
      if (!year) {
        errors.passedout_year = "Passed out year is required";
      } else if (!/^\d{4}$/.test(year)) {
        errors.passedout_year = "Year must be exactly 4 digits";
      } else {
        const yearNum = parseInt(year, 10);
        if (yearNum < 1950 || yearNum > currentYear + 5) {
          errors.passedout_year = `Year must be between 1950 and ${currentYear + 5}`;
        }
      }

      const college = (contactData.college || "").trim();
      if (!college) {
        errors.college = "College is required";
      } else if (college.length > 100) {
        errors.college = "College name must not exceed 100 characters";
      } else if (!/^[A-Za-z\s]+$/.test(college)) {
        errors.college =
          "College name should contain only letters and spaces (no numbers)";
      }

      const purpose = (contactData.purpose || "").trim();
      if (!purpose) {
        errors.purpose = "Purpose is required";
      } else if (purpose.length > 2500) {
        errors.purpose = "Purpose must not exceed 2500 characters";
      }

      const phone = (contactData.phone || "").trim();
      if (!phone) {
        errors.phone = "Phone is required";
      } else if (!/^\d{10}$/.test(phone)) {
        errors.phone = "Phone must be exactly 10 digits";
      }
    }

    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactType) {
      toast.error("Please select a user type.");
      return;
    }

    const trimmedData = {
      email: (contactData.email || "").trim(),
      ...(contactType === "student" && {
        name: (contactData.name || "").trim(),
        qualification: (contactData.qualification || "").trim(),
        passedout_year: (contactData.passedout_year || "").trim(),
        college: (contactData.college || "").trim(),
        purpose: (contactData.purpose || "").trim(),
        phone: (contactData.phone || "").trim(),
      }),
      ...contactData,
    };

    setContactData(trimmedData);

    if (!validateContactForm()) {
      return;
    }

    let url = "";
    let body = { email: trimmedData.email, extras: {} };

    switch (contactType) {
      case "student":
        url = "https://api.devtalent.securxperts.com:8000/contact/student";
        body = {
          ...body,
          name: trimmedData.name,
          qualification: trimmedData.qualification,
          passedout_year: trimmedData.passedout_year,
          college: trimmedData.college,
          purpose: trimmedData.purpose,
          phone: trimmedData.phone,
        };
        break;
      case "college":
        url = "https://api.devtalent.securxperts.com:8000/contact/college";
        body = {
          ...body,
          name: contactData.name,
          location: contactData.location,
          contact: contactData.contact,
          designation: contactData.designation,
          point_of_contact: contactData.point_of_contact,
        };
        break;
      case "recruiter":
        url = "https://api.devtalent.securxperts.com:8000/contact/recruiter";
        body = {
          ...body,
          company_name: contactData.company_name,
          designation: contactData.designation,
          point_of_contact_name: contactData.point_of_contact_name,
          phone: contactData.phone,
          using_platform: contactData.using_platform,
        };
        break;
      default:
        toast.error("Please select a contact type.");
        return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        console.log("✅ Contact form submitted! Showing toast...");
        toast.success("Contact form submitted successfully!");
        setIsContactOpen(false);
        setContactData({});
        setContactType("");
        setContactErrors({});
      } else {
        toast.error("Failed to submit contact form.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 overflow-x-hidden">
      {/* NAVBAR - Reduced extra spacing */}
      <header className="sticky top-0 z-50 bg-white  w-full">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 max-w-full">
          <div className="flex items-center justify-between">
            <img
              src={Devlogo}
              alt="DevTalent Logo"
              className="h-20 sm:h-12 lg:h-20 object-contain cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />

            <nav className="hidden lg:flex items-center space-x-4 sm:space-x-6 lg:space-x-8 flex-1 justify-center">
              {[
                "Home",
                "About Us",
                "Vision",
                "Solution",
                "Demo",
                "Contact Us",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === "Home") {
                      window.location.reload();
                    } else if (item === "Contact Us") {
                      setIsContactOpen(true); // 👉 open modal
                    } else {
                      document
                        .querySelector(
                          `#${item.toLowerCase().replace(" ", "-")}`,
                        )
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-gray-800 font-medium text-sm sm:text-base hover:text-[#961BAC] transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#961BAC] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <div
                ref={dropdownRef}
                className="hidden md:flex items-center space-x-2 sm:space-x-3"
              >
                {" "}
                <div className="relative">
                  <Button
                    onClick={() => {
                      setIsLoginDropdownOpen(!isLoginDropdownOpen);
                      setIsRegisterOpen(false);
                    }}
                    className="bg-gradient-to-r from-[#8A1EAB] to-[#39319D] text-white 
    h-[39px] px-6 py-[10px] rounded-md text-sm font-medium 
    hover:opacity-90 transition flex items-center gap-2"
                  >
                    Login As
                    {/* Arrow */}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isLoginDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </Button>

                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg border z-50">
                      <button
                        onClick={() => {
                          navigate("/login");
                          setIsLoginDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        College Student
                      </button>

                      <button
                        onClick={() => {
                          navigate("/individual");
                          setIsLoginDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Individual Student
                      </button>
                    </div>
                  )}
                </div>
                {/* REGISTER DROPDOWN */}
                <div className="relative">
                  <Button
                    onClick={() => {
                      setIsRegisterOpen(!isRegisterOpen);
                      setIsLoginDropdownOpen(false); // close other dropdown
                    }}
                    className="bg-gradient-to-r from-[#8A1EAB] to-[#39319D] text-white
      h-[39px] px-6 py-[10px] rounded-md text-sm font-medium
      hover:opacity-90 transition flex items-center gap-2"
                  >
                    Register As
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isRegisterOpen ? "rotate-180" : ""
                        }`}
                    />
                  </Button>

                  {isRegisterOpen && (
                    <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg border z-50">
                      <button
                        onClick={() => {
                          navigate("/registration");
                          setIsRegisterOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        College Student
                      </button>

                      <button
                        onClick={() => {
                          navigate("/register");
                          setIsRegisterOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Individual Student
                      </button>
                    </div>
                  )}
                </div>
                {/* <Button
                  onClick={() => setIsContactOpen(true)}
                  className="bg-white text-[#33329C] border border-purple-300 rounded-full px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-medium hover:bg-purple-50 transition"
                >
                  Contact us
                </Button> */}
                <div className="relative">
                  <Button
                    onClick={() => {
                      setIsAdminDropdownOpen(!isAdminDropdownOpen);
                      setIsLoginDropdownOpen(false);
                      setIsRegisterOpen(false);
                    }}
                    className="h-[39px] w-full px-6 py-[10px] rounded-md text-[16px] font-bold 
    bg-white text-[#3E319E] 
    border border-transparent
    [background:linear-gradient(white,white)_padding-box,linear-gradient(90deg,#8020A9,#3E319E)_border-box]
    hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <User size={18} />
                    Admin Login
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isAdminDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </Button>

                  {/* DROPDOWN */}
                  {isAdminDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg border z-[99999]">
                      <button
                        onClick={() => {
                          setIsAdminLoginOpen(true); // ✅ open popup
                          setIsAdminDropdownOpen(false); // close dropdown
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm border-b border-gray-100"
                      >
                        College Student
                      </button>

                      <button
                        onClick={() => {
                          navigate("/adminlogin"); // change route if needed
                          setIsAdminDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                      >
                        Individual Student
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-800 p-1.5 sm:p-2"
              >
                {isMobileMenuOpen ? (
                  <X size={window.innerWidth < 640 ? 24 : 28} />
                ) : (
                  <Menu size={window.innerWidth < 640 ? 24 : 28} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-3 sm:mt-4 pb-3 sm:pb-4 border-t border-purple-200 pt-3 sm:pt-4 bg-purple-100 w-full">
              <nav className="flex flex-col space-y-3 sm:space-y-4 mb-3 sm:mb-4 w-full">
                {[
                  "Home",
                  "About Us",
                  "Vision",
                  "Solution",
                  "Demo",
                  "Contact Us",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      if (item === "Home") {
                        window.location.reload();
                      } else if (item === "Contact Us") {
                        setIsContactOpen(true); // ✅ open modal
                      } else {
                        document
                          .querySelector(
                            `#${item.toLowerCase().replace(" ", "-")}`,
                          )
                          ?.scrollIntoView({ behavior: "smooth" });
                      }

                      setIsMobileMenuOpen(false); // ✅ close mobile menu
                    }}
                    className="text-gray-800 font-medium text-left text-base sm:text-lg hover:text-[#961BAC] transition px-2 py-1"
                  >
                    {item}
                  </button>
                ))}
              </nav>

              <div ref={mobileDropdownRef} className="flex flex-col space-y-2 sm:space-y-3 px-2">
                <div className="relative w-full">
                  <Button
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="bg-gradient-to-r from-[#8A1EAB] to-[#39319D] text-white 
  px-4 py-2 text-sm font-medium w-full flex items-center justify-center gap-2"
                  >
                    Login As
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isLoginDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </Button>

                  {isLoginDropdownOpen && (
                    <div className="mt-2 w-full bg-white rounded-md shadow-lg border">
                      <button
                        onClick={() => {
                          navigate("/login");
                          setIsLoginDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        College Student
                      </button>

                      <button
                        onClick={() => {
                          navigate("/individual");
                          setIsLoginDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Individual Student
                      </button>
                    </div>
                  )}
                </div>

                {/* REGISTER DROPDOWN */}
                <div className="relative w-full">
                  <Button
                    onClick={() => {
                      setIsRegisterOpen(!isRegisterOpen);
                      setIsLoginDropdownOpen(false); // close other dropdown
                    }}
                    className="bg-gradient-to-r from-[#8A1EAB] to-[#39319D] text-white 
  px-4 py-2 text-sm font-medium w-full flex items-center justify-center gap-2"
                  >
                    Register As
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isRegisterOpen ? "rotate-180" : ""
                        }`}
                    />
                  </Button>

                  {isRegisterOpen && (
                    <div className="mt-2 w-full bg-white rounded-md shadow-lg border">
                      <button
                        onClick={() => {
                          navigate("/register");
                          setIsRegisterOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Individual
                      </button>

                      <button
                        onClick={() => {
                          navigate("/registration");
                          setIsRegisterOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        College Student
                      </button>
                    </div>
                  )}
                </div>

                {/* <Button
                  onClick={() => {
                    setIsContactOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-white text-[#33329C] border border-purple-300 rounded-full py-5 font-medium text-lg hover:bg-purple-50"
                >
                  Contact us
                </Button> */}
                <div className="relative">
                  <Button
                    onClick={() => {
                      setIsAdminDropdownOpen(!isAdminDropdownOpen);
                      setIsLoginDropdownOpen(false);
                      setIsRegisterOpen(false);
                    }}
                    className="h-[39px] w-full px-6 py-[10px] rounded-md text-[16px] font-bold 
    bg-white text-[#3E319E] 
    border border-transparent
    [background:linear-gradient(white,white)_padding-box,linear-gradient(90deg,#8020A9,#3E319E)_border-box]
    hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <User size={18} />
                    Admin Login
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isAdminDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </Button>

                  {/* DROPDOWN */}
                  {isAdminDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-full bg-white rounded-md shadow-lg border z-50">
                      <button
                        onClick={() => {
                          setIsAdminLoginOpen(true); // ✅ open popup
                          setIsAdminDropdownOpen(false); // close dropdown
                          setIsMobileMenuOpen(false); // close mobile menu
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm border-b border-gray-100"
                      >
                        College Student
                      </button>

                      <button
                        onClick={() => {
                          navigate("/adminlogin"); // change route if needed
                          setIsAdminDropdownOpen(false);
                          setIsMobileMenuOpen(false); // close mobile menu
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                      >
                        Individual Student
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <HeroSection onLoginClick={() => setIsLoginOpen(true)} />

      {/* ABOUT SECTION */}
      <AboutSection />

      <Vision />

      <ImpactSection />

      {/* VISION */}
      {/* <VisionSection /> */}

      {/* COMMON PAIN POINTS */}
      {/* <CommonPainPointsSection /> */}

      {/* OUR SOLUTION */}
      <SolutionsSection />

      {/* DEMO */}
      <DemoSection />

      <ContactUsSection />

      {/* GALLERY */}
      {/* <GallerySection /> */}

      {/* FOOTER */}
      {/* <footer
        className="text-[#4A289D] pt-8 sm:pt-10 pb-8 sm:pb-10 w-full overflow-x-hidden"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #F6B5F6 65%, #F5A9F5 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-0">
            <div className="w-full lg:w-auto">
              <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 lg:gap-12">
                <img
                  src={icon}
                  alt="DevTalent"
                  className="h-20 sm:h-24 lg:h-36 object-contain"
                />
              </div>
              <p className="mt-4 sm:mt-6 lg:mt-8 text-sm leading-relaxed text-center lg:text-left">
                One Platform for Assessments, Interviews and Results.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-32 lg:pr-0 lg:pr-32 w-full lg:w-auto">
              
              <div className="text-center sm:text-left">
                <h3 className="font-semibold mb-4 sm:mb-6 lg:mb-8 text-sm">
                  Follow us
                </h3>
                <ul className="space-y-3 sm:space-y-4 lg:space-y-5 text-sm">
                  <li>
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/securxpert-technologies-pvt-ltd/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Linkedin
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/securxpert/profilecard/?igsh=eGNnNnloajlyZmI1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/securxpert-technologies-pvt-ltd/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Youtube
                    </a>
                  </li>
                </ul>
              </div>

              
              <div className="text-center sm:text-left">
                <h3 className="font-semibold mb-4 sm:mb-6 text-sm">Address</h3>

                <div className="flex items-start justify-center sm:justify-start gap-2 max-w-full sm:max-w-[280px]">
                  <MdLocationOn
                    size={40}
                    className="text-[#4A289D] mt-[-8px] sm:mt-[-12px] lg:mt-[-16px] flex-shrink-0"
                  />
                  <p className="text-sm leading-relaxed">
                    Securxperts Technologies Pvt Ltd.
                    <br /> 3rd Floor, PR R One Towers, Plot No 59, DLF Rd, near
                    Radisson Hotel, Jayabheri Enclave, Gachibowli, Hyderabad,
                    Telangana 500032
                  </p>
                </div>

                
                <div className="mt-3 sm:mt-5 text-sm space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <MdEmail className="text-[#4A289D]" size={16} />
                    <span className="font-semibold">Support Email:</span>{" "}
                    <a
                      href="mailto:support@devtalent.com"
                      className="hover:underline"
                    >
                      support@devtalent.com
                    </a>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <MdPhone className="text-[#4A289D]" size={16} />
                    <span className="font-semibold">Phone:</span>{" "}
                    <a href="tel:+91 7993256679" className="hover:underline">
                      +91 7993256679
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="mt-6 sm:mt-8" />

          <div className="mt-4 sm:mt-5">
            <div className="flex justify-center gap-6 sm:gap-8 lg:gap-10 text-xs flex-wrap">
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
              <a href="/condition" className="hover:underline">
                Terms of Use
              </a>
            </div>
            <p className="mt-3 sm:mt-5 text-center text-xs">
              © 2025 All Rights Reserved
            </p>
          </div>
        </div>
      </footer> */}
      <Footer />

      {/* ADMIN LOGIN */}
      <Dialog
        open={isAdminLoginOpen}
        onOpenChange={(open) => {
          setIsAdminLoginOpen(open);
          if (!open) {
            setAdminLoginData({ email: "", password: "" });
            setShowAdminPassword(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-3xl font-bold text-[#961BAC]">
              Admin Login
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <Label>
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={adminLoginData.email}
                maxLength={30}
                onChange={(e) =>
                  setAdminLoginData({
                    ...adminLoginData,
                    email: e.target.value,
                  })
                }
                required
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label>
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  name="admin-password"
                  autoComplete="current-password"
                  type={showAdminPassword ? "text" : "password"}
                  value={adminLoginData.password}
                  maxLength={30}
                  onChange={(e) =>
                    setAdminLoginData({
                      ...adminLoginData,
                      password: e.target.value,
                    })
                  }
                  required
                  className="h-12 rounded-xl pr-16"
                />

                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                >
                  {showAdminPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#961BAC] to-[#33329C] rounded-xl shadow-xl hover:scale-105 transition"
            >
              Admin Login
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONTACT DIALOG */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto p-8">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-3xl font-bold text-[#33329C]">
              Contact Us
            </DialogTitle>
            <DialogDescription className="text-lg">
              Fill out the form to get in touch with us
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <Select
              value={contactType}
              onValueChange={(value) => {
                setContactType(value);
                setContactData({});
                setContactErrors({});
              }}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Individual Student</SelectItem>
                <SelectItem value="college">College Student</SelectItem>
                <SelectItem value="recruiter">Company Recruiter</SelectItem>
              </SelectContent>
            </Select>

            {contactType === "student" && (
              <>
                <div>
                  <Label>
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter your full name"
                    value={contactData.name || ""}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^A-Za-z\s]/g, "")
                        .slice(0, 50);
                      setContactData({ ...contactData, name: value });
                    }}
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                  {contactErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={contactData.email || ""}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        email: e.target.value.slice(0, 100),
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                  {contactErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label>
                    Qualification <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter your qualification"
                    value={contactData.qualification || ""}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        qualification: e.target.value.slice(0, 30),
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                  {contactErrors.qualification && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactErrors.qualification}
                    </p>
                  )}
                </div>

                <div>
                  <Label>
                    Passed Out Year <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="YYYY"
                    value={contactData.passedout_year || ""}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        passedout_year: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4),
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                  {contactErrors.passedout_year && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactErrors.passedout_year}
                    </p>
                  )}
                </div>

                <div>
                  <Label>
                    College <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter your college name"
                    value={contactData.college || ""}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^A-Za-z\s]/g, "")
                        .slice(0, 100);
                      setContactData({ ...contactData, college: value });
                    }}
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                  {contactErrors.college && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactErrors.college}
                    </p>
                  )}
                </div>

                <div>
                  <Label>
                    Purpose <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    placeholder="Enter your purpose"
                    value={contactData.purpose || ""}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        purpose: e.target.value.slice(0, 2500),
                      })
                    }
                    required
                    className="rounded-xl"
                    rows={4}
                  />
                  {contactErrors.purpose && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactErrors.purpose}
                    </p>
                  )}
                </div>

                <div>
                  <Label>
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter 10-digit mobile number"
                    value={contactData.phone || ""}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                  {contactErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactErrors.phone}
                    </p>
                  )}
                </div>
              </>
            )}

            {contactType === "college" && (
              <>
                <div>
                  <Label>
                    Institution Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Institution Name"
                    value={contactData.name || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                      setContactData({ ...contactData, name: value });
                    }}
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                </div>
                <div>
                  <Label>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={contactData.email || ""}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        email: e.target.value.slice(0, 100),
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                  {contactErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label>
                    Location (City, State){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Location (City, State)"
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        location: e.target.value,
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                </div>
                <div>
                  <Label>
                    Contact Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Contact Email"
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        contact: e.target.value,
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                </div>
                <div>
                  <Label>
                    Your Designation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Your Designation"
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        designation: e.target.value,
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                </div>
                <div>
                  <Label>
                    Point of Contact Name{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Point of Contact Name"
                    value={contactData.point_of_contact || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                      setContactData({
                        ...contactData,
                        point_of_contact: value,
                      });
                    }}
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                </div>
              </>
            )}

            {contactType === "recruiter" && (
              <>
                <div>
                  <Label>
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Company Name"
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        company_name: e.target.value,
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                </div>
                <div>
                  <Label>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={contactData.email || ""}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        email: e.target.value.slice(0, 100),
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                  {contactErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {contactErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label>
                    Your Designation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Your Designation"
                    value={contactData.designation || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                      setContactData({ ...contactData, designation: value });
                    }}
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                </div>
                <div>
                  <Label>
                    Point of Contact Name{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Point of Contact Name"
                    value={contactData.point_of_contact_name || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                      setContactData({
                        ...contactData,
                        point_of_contact_name: value,
                      });
                    }}
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                </div>
                <div>
                  <Label>
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Phone Number"
                    value={contactData.phone || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9+\s-]/g, "");
                      setContactData({ ...contactData, phone: value });
                    }}
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                </div>
                <div>
                  <Label>
                    How are you planning to use the platform?{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="How are you planning to use the platform?"
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        using_platform: e.target.value,
                      })
                    }
                    required
                    className="h-12 rounded-xl"
                    maxLength={30}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#961BAC] to-[#33329C] rounded-xl shadow-xl hover:scale-105 transition"
            >
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
