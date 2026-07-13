import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import logo from "../assests/logo.png";

interface College {
  id: number;
  name: string;
  passkey_expires_at: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    collegeName: "",
    collegePasskey: "",
  });

  const [colleges, setColleges] = useState<College[]>([]);
  const [showUserPassword, setShowUserPassword] = useState<boolean>(false);
  const [showCollegePasskey, setShowCollegePasskey] = useState<boolean>(false);

  // 🔹 Fetch colleges (unchanged)
  useEffect(() => {
    const fetchColleges = async (): Promise<void> => {
      try {
        const res = await fetch(
          "https://api.devtalent.securxperts.com:8000/admin/colleges",
        );
        if (res.ok) {
          const data: College[] = await res.json();
          setColleges(data);
        }
      } catch {
        toast.error("Failed to load colleges");
      }
    };

    fetchColleges();
  }, []);

  // 🔹 Login handler (unchanged)
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const { email, password, collegeName, collegePasskey } = loginData;

    if (!email || !password || !collegeName || !collegePasskey) {
      toast.error("Invalid credentials. Please fill all required fields.");
      return;
    }

    const selectedCollege = colleges.find((c) => c.name === collegeName);

    if (
      selectedCollege &&
      new Date(selectedCollege.passkey_expires_at) < new Date()
    ) {
      toast.error("This college is inactive. Contact admin.");
      return;
    }

    try {
      const response = await fetch(
        "https://api.devtalent.securxperts.com:8000/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            college_name: collegeName,
            college_passkey: collegePasskey,
          }),
        },
      );

      if (response.ok) {
        const data: { access_token: string } = await response.json();

        localStorage.clear();
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userCollege", collegeName);
        localStorage.setItem("userToken", data.access_token);

        toast.success("Login successful!");
        navigate("/terms");
      } else {
        toast.error(
          "Invalid credentials. Please check your email or password.",
        );
      }
    } catch {
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#efe8ff] to-white flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 overflow-x-hidden">
      <div className="w-full max-w-6xl xl:max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0 relative">
        {/* LEFT SECTION */}
        <div className="w-full lg:w-auto lg:max-w-[460px] flex-shrink-0 mx-auto lg:mx-0">
          {/* Logo */}
          <img
            src={logo}
            alt="DevTalent"
            className="h-12 sm:h-14 md:h-16 lg:h-20 mb-4 sm:mb-6 lg:mb-8 mx-auto lg:ml-3"
          />

          {/* Login Card */}
          <div className="bg-white rounded-[12px] sm:rounded-[16px] lg:rounded-[18px] shadow-lg sm:shadow-xl px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8 w-full max-w-md mx-auto lg:mx-0 lg:w-auto">
            {/* Header */}
            <div className="flex items-center gap-2 text-[#7B2CBF] font-semibold text-lg sm:text-xl">
              <button
                onClick={() => navigate(-1)}
                className="text-xl sm:text-2xl leading-none hover:text-[#5a2390] transition-colors"
              >
                ←
              </button>
              Login
            </div>

            <p className="text-gray-500 mt-1 mb-3 sm:mb-4 text-sm sm:text-base">
              Login to access your exam portal
            </p>

            {/* Divider */}
            <div className="h-px bg-gray-200 mb-4 sm:mb-6" />

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              {/* Email */}
              <div>
                <Label className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  maxLength={50}
                  required
                  className="h-10 sm:h-11 rounded-md border-gray-300 text-sm sm:text-base"
                />
              </div>

              {/* Password */}
              <div>
                <Label className="text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showUserPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      })
                    }
                    minLength={8}
                    maxLength={20}
                    required
                    className="h-10 sm:h-11 rounded-md border-gray-300 pr-12 sm:pr-14 text-sm sm:text-base"
                  />

                  <button
                    type="button"
                    onClick={() => setShowUserPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showUserPassword ? (
                      <EyeOff size={16} className="sm:size-18" />
                    ) : (
                      <Eye size={16} className="sm:size-18" />
                    )}
                  </button>
                </div>
              </div>

              {/* College Name */}
              <div>
                <Label className="text-sm font-medium">
                  College Name <span className="text-red-500">*</span>
                </Label>
                <select
                  value={loginData.collegeName}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      collegeName: e.target.value.slice(0, 50),
                    })
                  }
                  className="w-full h-10 sm:h-11 border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#7B2CBF] focus:border-transparent"
                >
                  <option value="">Select College Name</option>
                  {colleges.map((c) => (
                    <option
                      key={c.id}
                      value={c.name}
                      disabled={new Date(c.passkey_expires_at) < new Date()}
                    >
                      {c.name}{" "}
                      {new Date(c.passkey_expires_at) < new Date() &&
                        "(Inactive)"}
                    </option>
                  ))}
                </select>
              </div>

              {/* College Passkey */}
              <div>
                <Label className="text-sm font-medium">
                  College Pass key <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showCollegePasskey ? "text" : "password"}
                    placeholder="Enter College Pass key"
                    value={loginData.collegePasskey}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        collegePasskey: e.target.value,
                      })
                    }
                    minLength={5}
                    maxLength={20}
                    required
                    className="h-10 sm:h-11 rounded-md border-gray-300 pr-12 sm:pr-14 text-sm sm:text-base"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCollegePasskey((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCollegePasskey ? (
                      <EyeOff size={16} className="sm:size-18" />
                    ) : (
                      <Eye size={16} className="sm:size-18" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm sm:text-base font-semibold bg-gradient-to-r from-[#7B2CBF] to-[#3C096C] rounded-md shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                Login
              </Button>
            </form>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden lg:block lg:relative lg:right-0 lg:top-0 lg:h-screen lg:w-1/2 xl:w-3/5">
          <img
            src="/stud-login.png"
            alt="Student"
            className="h-full w-full object-contain object-right"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
