import {
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import icon from "../assests/icon.png"; // ✅ fix spelling

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-purple-50 to-purple-100 text-gray-800 py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-10">
          {/* Company Info */}
          <div className="text-center lg:text-left">
            <img src="/img/Logo.svg" alt="" className="mx-auto lg:mx-0" />
            <p className="font-semibold text-[#6F24A6] pt-2 text-base sm:text-lg">
              One Platform for Assessments and Results
            </p>
          </div>

          {/* Right Section */}
          <div className="flex flex-col sm:flex-row lg:flex-nowrap justify-between gap-10 sm:gap-16 lg:gap-12 w-full text-center sm:text-left">
            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold text-[#33329C] mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <a className="text-gray-600 hover:text-purple-600 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-purple-600 transition-colors">
                    Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-lg font-semibold text-[#33329C] mb-4">
                Follow Us
              </h4>
              <div className="flex flex-col space-y-3 items-center sm:items-start">
                <a
                  href="https://www.facebook.com/people/SecurXpert-Technologies-Pvt-Ltd/61576099186187/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
                >
                  <Facebook size={18} />
                  <span>Facebook</span>
                </a>

                <a
                  href="https://www.linkedin.com/company/securxpert-technologies-pvt-ltd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
                >
                  <Linkedin size={18} />
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://www.instagram.com/securxpert/profilecard/?igsh=eGNnNnloajlyZmI1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
                >
                  <Instagram size={18} />
                  <span>Instagram</span>
                </a>

                <a
                  href="https://www.youtube.com/@SecurXpert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
                >
                  <Youtube size={18} />
                  <span>YouTube</span>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-[#33329C] mb-4">
                Contact Info
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Phone size={18} className="text-purple-600" />
                  <a
                    href="tel:+91 7993256679"
                    className="text-gray-600 hover:text-purple-600 text-sm"
                  >
                    +91 7993256679
                  </a>
                </div>

                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Mail size={18} className="text-purple-600" />
                  <a
                    href="mailto:support@devtalent.com"
                    className="text-gray-600 hover:text-purple-600 text-sm"
                  >
                    support@devtalent.com
                  </a>
                </div>

                <div className="flex items-start justify-center sm:justify-start space-x-2">
                  <MapPin size={18} className="text-purple-600 mt-1" />
                  <p className="text-gray-600 text-sm text-center sm:text-left">
                    Securxperts Technologies Pvt Ltd.
                    <br />
                    3rd Floor, PR R One Towers, Plot No 59,
                    <br />
                    DLF Rd, Gachibowli, Hyderabad,
                    <br />
                    Telangana 500032
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-gray-600 text-sm">© 2026 All Rights Reserved.</p>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm relative ">
                Powered by
              </span>
              <img
                src={icon}
                alt="DevTalent"
                className="h-8 sm:h-10 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
