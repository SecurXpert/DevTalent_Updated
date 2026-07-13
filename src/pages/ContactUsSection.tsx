import { useState } from "react";

import { MapPin, Mail, Phone } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

const ContactUsSection = () => {
  const [selectedType, setSelectedType] = useState("");

  const [formData, setFormData] = useState({
    name: "",

    email: "",

    message: "",

    qualification: "",

    passedout_year: "",

    college: "",

    purpose: "",

    phone: "",

    location: "",

    contact: "",

    designation: "",

    point_of_contact: "",

    company_name: "",

    point_of_contact_name: "",

    using_platform: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // ✅ Passed Out Year restriction (PLACE HERE)
    if (name === "passedout_year") {
      const numericValue = value.replace(/\D/g, "").slice(0, 4);

      setFormData({
        ...formData,
        [name]: numericValue,
      });

      setErrors({
        ...errors,
        [name]: "",
      });

      return;
    }

    // ✅ Phone number restriction
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10); // only digits, max 10

      setFormData({
        ...formData,
        [name]: numericValue,
      });

      setErrors({
        ...errors,
        [name]: "",
      });

      return;
    }

    // Only allow letters for name fields
    if (name === "name" && value && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    }

    // ✅ Normal update for other fields
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateEmail = (email: string) => {
    const trimmedEmail = email.trim();

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return "Enter valid email format";
    }

    // Check for Gmail and prevent characters after @gmail.com
    const localPart = trimmedEmail.split("@")[0];
    const domain = trimmedEmail.split("@")[1];

    if (domain.toLowerCase().startsWith("gmail.com")) {
      // Check if there are any characters after gmail.com
      if (domain.toLowerCase() !== "gmail.com") {
        return " Enter valid email id";
      }
    }

    // Additional validation for common domains
    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "rediff.com",
    ];
    const domainLower = domain.toLowerCase();

    for (const commonDomain of commonDomains) {
      if (
        domainLower.startsWith(commonDomain) &&
        domainLower !== commonDomain
      ) {
        return `No characters allowed after @${commonDomain}`;
      }
    }

    return null; // No error
  };

  const validateForm = () => {
    const err: any = {};

    const email = (formData.email || "").trim();

    if (!email) {
      err.email = "Email is required";
    } else {
      const emailError = validateEmail(email);
      if (emailError) {
        err.email = emailError;
      }
    }

    // Validate contact email for college form
    if (selectedType === "college") {
      const contactEmail = (formData.contact || "").trim();
      if (!contactEmail) {
        err.contact = "Contact email required";
      } else {
        const contactEmailError = validateEmail(contactEmail);
        if (contactEmailError) {
          err.contact = contactEmailError;
        }
      }
    }

    if (selectedType === "student") {
      const name = (formData.name || "").trim();

      if (!name) err.name = "Name is required";
      else if (!/^[A-Za-z\s]+$/.test(name)) err.name = "Only letters allowed";

      if (!formData.qualification) err.qualification = "Qualification required";

      const year = (formData.passedout_year || "").trim();
      const currentYear = new Date().getFullYear();

      if (!year) {
        err.passedout_year = "Year is required";
      } else if (!/^\d{4}$/.test(year)) {
        err.passedout_year = "Year must be exactly 4 digits";
      } else {
        const yearNum = parseInt(year, 10);

        if (yearNum < 1950 || yearNum > currentYear + 5) {
          err.passedout_year = `Year must be between 1950 and ${currentYear + 5}`;
        }
      }

      if (!formData.college) err.college = "College required";

      if (!formData.purpose) err.purpose = "Purpose required";

      if (!formData.phone) err.phone = "Phone required";
      else if (!/^\d{10}$/.test(formData.phone))
        err.phone = "Phone must be 10 digits";
    }

    if (selectedType === "college") {
      if (!formData.name) err.name = "Institution name required";

      if (!formData.location) err.location = "Location required";

      if (!formData.contact) err.contact = "Contact email required";

      if (!formData.designation) err.designation = "Designation required";

      if (!formData.point_of_contact)
        err.point_of_contact = "Point of contact required";
    }

    if (selectedType === "recruiter") {
      if (!formData.company_name) err.company_name = "Company name required";

      if (!formData.designation) err.designation = "Designation required";

      if (!formData.point_of_contact_name)
        err.point_of_contact_name = "POC name required";

      if (!formData.phone) err.phone = "Phone required";

      if (!formData.using_platform) err.using_platform = "Required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    let url = "";

    let body: any = {};

    switch (selectedType) {
      case "student":
        url = "https://api.devtalent.securxperts.com:8000/contact/student";

        body = {
          email: formData.email,

          name: formData.name,

          qualification: formData.qualification,

          passedout_year: formData.passedout_year,

          college: formData.college,

          purpose: formData.purpose,

          phone: formData.phone,
        };

        break;

      case "college":
        url = "https://api.devtalent.securxperts.com:8000/contact/college";

        body = {
          email: formData.email,

          name: formData.name,

          location: formData.location,

          contact: formData.contact,

          designation: formData.designation,

          point_of_contact: formData.point_of_contact,
        };

        break;

      case "recruiter":
        url = "https://api.devtalent.securxperts.com:8000/contact/recruiter";

        body = {
          email: formData.email,

          company_name: formData.company_name,

          designation: formData.designation,

          point_of_contact_name: formData.point_of_contact_name,

          phone: formData.phone,

          using_platform: formData.using_platform,
        };

        break;
    }

    try {
      const response = await fetch(url, {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success("Contact form submitted successfully!");

        setFormData({
          name: "",
          email: "",
          message: "",
          qualification: "",

          passedout_year: "",
          college: "",
          purpose: "",
          phone: "",

          location: "",
          contact: "",
          designation: "",
          point_of_contact: "",

          company_name: "",
          point_of_contact_name: "",
          using_platform: "",
        });

        setSelectedType("");
      } else {
        toast.error("Failed to submit contact form.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <section
      id="contact-us"
      className="relative w-full min-h-screen lg:min-h-[960px]

 
      bg-[linear-gradient(180deg,#6F24A6_-67.07%,#FFFFFF_18.59%,#FFFFFF_100%)]
 
      flex items-center justify-center py-12 lg:py-24 overflow-hidden"
    >
      {/* Background decorative elements */}

      <div className="absolute inset-0">
        <img
          className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 hidden lg:block"
          src="/img/dotsimg.svg"
          alt="dots"
        />

        {/* ===== Bottom RIGHT HALF Visible Decor ===== */}
        <div className="absolute -bottom-32 -right-32 pointer-events-none">
          <img
            src="/img/Graphic D.svg"
            alt="decor"
            className="w-[260px] md:w-[320px] object-contain"
          />
        </div>

        <div className="absolute -bottom-16 right-16 pointer-events-none">
          <img
            src="/img/dotsimg.svg"
            alt="dots"
            className="w-[140px] md:w-[180px] opacity-40 object-contain"
          />
        </div>

        {/* ===== Bottom Left HALF Visible Decor ===== */}
        <div className="absolute bottom-0 -left-8 pointer-events-none">
          {/* Bottom Left Corner Dots (Same style as top-right) */}
          <img
            className="absolute left-0 bottom-0 translate-x-6 -translate-y-6 
             w-[120px] md:w-[160px] opacity-40 object-contain 
             pointer-events-none z-20"
            src="/img/dotsimg.svg"
            alt="dots"
          />
        </div>

        <div className="absolute -bottom-32 -left-32 pointer-events-none">
          <img
            src="/img/Graphic D.svg"
            alt="decor"
            className="w-[260px] md:w-[320px] object-contain"
          />
        </div>

        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="grid grid-cols-12 grid-rows-12 h-full">
            {[...Array(144)].map((_, i) => (
              <div key={i}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div
          className="relative max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10 lg:p-20
 lg:p-20 lg:mb-20 overflow-hidden"
        >
          {/* Bottom Left Container Dots */}
          <div className="absolute -bottom-10 -left-10 pointer-events-none">
            <img
              src="/img/dotsimg.svg"
              alt="dots"
              className="w-[120px] md:w-[160px] opacity-40 object-contain"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* ================= LEFT COLUMN ================= */}

            <div className="flex flex-col min-h-[500px] lg:h-[600px]">
              {/* CONTACT US HEADING */}

              <h2 className="font-bold text-3xl text-[#6F24A6] pb-8">
                CONTACT US
              </h2>

              <p className="font-bold text-[#6F24A6] mb-4 text-lg">User Type</p>

              {/* Dropdown */}

              <div className="mb-4">
                <Select
                  value={selectedType}
                  onValueChange={(value) => setSelectedType(value)}
                >
                  <SelectTrigger className="h-12  rounded-xl border-2 border-purple-200 text-lg w-8/12">
                    <SelectValue placeholder="Select User Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="student">Individual Student</SelectItem>

                    <SelectItem value="recruiter">Company Recruiter</SelectItem>

                    <SelectItem value="college">College Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FORM */}

              <div className="flex-1 lg:overflow-y-auto pr-2">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
                  {selectedType === "student" && "Student Information"}

                  {selectedType === "recruiter" && "Recruiter Information"}

                  {selectedType === "college" && "College Information"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* KEEPING YOUR ORIGINAL FORM FIELDS EXACTLY SAME */}

                  {/* Student */}

                  {selectedType === "student" && (
                    <>
                      <div>
                        <Label>Name *</Label>

                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                          maxLength={30}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <Label>Email *</Label>

                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label>Qualification *</Label>

                        <Input
                          type="text"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.qualification && (
                          <p className="text-red-500 text-sm">
                            {errors.qualification}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Passed Out Year *</Label>

                        <Input
                          type="text"
                          name="passedout_year"
                          value={formData.passedout_year}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.passedout_year && (
                          <p className="text-red-500 text-sm">
                            {errors.passedout_year}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>College *</Label>

                        <Input
                          type="text"
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.college && (
                          <p className="text-red-500 text-sm">
                            {errors.college}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Purpose *</Label>

                        <Textarea
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleChange}
                          className="rounded-xl ms-1"
                          rows={4}
                          required
                        />
                        {errors.purpose && (
                          <p className="text-red-500 text-sm">
                            {errors.purpose}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Phone *</Label>

                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm">{errors.phone}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Recruiter */}

                  {selectedType === "recruiter" && (
                    <>
                      <div>
                        <Label>Company Name *</Label>

                        <Input
                          type="text"
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.company_name && (
                          <p className="text-red-500 text-sm">
                            {errors.company_name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Email *</Label>

                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label>Designation *</Label>

                        <Input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.designation && (
                          <p className="text-red-500 text-sm">
                            {errors.designation}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Point of Contact Name *</Label>

                        <Input
                          type="text"
                          name="point_of_contact_name"
                          value={formData.point_of_contact_name}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.point_of_contact_name && (
                          <p className="text-red-500 text-sm">
                            {errors.point_of_contact_name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Phone *</Label>

                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <Label>
                          How are you planning to use the platform? *
                        </Label>

                        <Input
                          type="text"
                          name="using_platform"
                          value={formData.using_platform}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.using_platform && (
                          <p className="text-red-500 text-sm">
                            {errors.using_platform}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* College */}

                  {selectedType === "college" && (
                    <>
                      <div>
                        <Label>Institution Name *</Label>

                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <Label>Email *</Label>

                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label>Location *</Label>

                        <Input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.location && (
                          <p className="text-red-500 text-sm">
                            {errors.location}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Contact Email *</Label>

                        <Input
                          type="email"
                          name="contact"
                          value={formData.contact}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.contact && (
                          <p className="text-red-500 text-sm">
                            {errors.contact}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Your Designation *</Label>

                        <Input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.designation && (
                          <p className="text-red-500 text-sm">
                            {errors.designation}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Point of Contact Name *</Label>

                        <Input
                          type="text"
                          name="point_of_contact"
                          value={formData.point_of_contact}
                          onChange={handleChange}
                          className="h-12 rounded-xl ms-1"
                          required
                        />
                        {errors.point_of_contact && (
                          <p className="text-red-500 text-sm">
                            {errors.point_of_contact}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition duration-300 shadow-lg"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}

            <div className="flex flex-col h-[600px] justify-center">
              <div className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">Address</p>

                      <p className="text-gray-600">
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

                  <div className="flex items-start space-x-4">
                    <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">Email</p>

                      <p className="text-gray-600">
                        {" "}
                        <a
                          href="mailto:support@devtalent.com"
                          className=" hover:text-purple-600 text-sm"
                        >
                          support@devtalent.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">Phone</p>

                      <p className="text-gray-600">
                        {" "}
                        <a
                          href="tel:+91 7993256679"
                          className="hover:text-purple-600 text-sm"
                        >
                          +91 7993256679
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[220px] md:h-64 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1110.0173847142587!2d78.36249183915633!3d17.447583559555422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb912366b612f9%3A0x73417cb704748474!2sSecurXpert%20Technologies%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1770809088947!5m2!1sen!2sin%22"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
