import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  ChevronRight,
  Download,
  Lock,
  Star,
  CheckCircle,
  Award,
  TrendingUp,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import { API_BASE_URL } from "@/pages/Services/api/api";

interface Level {
  id: string;

  title: string;

  subtitle: string;

  exams: string;

  status: "qualified" | "locked" | "unlocked";

  icon: React.ElementType;

  color: string;

  headerBg?: string;

  name?: string;

  subName?: string;

  certificateId?: string;

  issueDate?: string;

  benefits: string[];

  course_id?: number;

  certificate_url?: string;

  certificateDbId?: number;
}

const INITIAL_LEVELS: Level[] = [
  {
    id: "L1",

    title: "L1",

    subtitle: "Beginner",

    exams: "2/2 exams",

    status: "unlocked",

    icon: CheckCircle,

    color: "",

    headerBg: "bg-gradient-to-r from-green-500 to-emerald-600",

    name: "Level 1",

    subName: "Basic Certification",

    certificateId: "CERT-L1-2024-001",

    issueDate: "14/02/2026",

    course_id: 1,

    certificate_url: "",

    benefits: [
      "Foundation level certification",

      "Basic skill validation",

      "Entry-level recognition",
    ],
  },

  {
    id: "L2",

    title: "L2",

    subtitle: "Intermediate",

    exams: "4/4 exams",

    status: "unlocked",

    icon: Star,

    color: "",

    headerBg: "bg-gradient-to-r from-blue-500 to-indigo-600",

    name: "Level 2",

    subName: "Intermediate Certification",

    certificateId: "CERT-L2-2024-001",

    issueDate: "14/02/2026",

    course_id: 2,

    certificate_url: "",

    benefits: [
      "Intermediate certification",

      "Enhanced credibility",

      "Industry recognition",
    ],
  },

  {
    id: "L3",

    title: "L3",

    subtitle: "Mid",

    exams: "6/6 exams",

    status: "unlocked",

    icon: Trophy,

    color: "",

    headerBg: "bg-gradient-to-r from-orange-500 to-red-500",

    name: "Level 3",

    subName: "Mid Certification",

    certificateId: "CERT-L3-2024-001",

    issueDate: "14/02/2026",

    course_id: 3,

    certificate_url: "",

    benefits: [
      "Advanced technical validation",

      "Leadership credibility",

      "Professional recognition",
    ],
  },

  {
    id: "L4",

    title: "L4",

    subtitle: "Advanced",

    exams: "",

    status: "locked",

    icon: Lock,

    color: "bg-gray-300",

    headerBg: "bg-gradient-to-r from-yellow-400 to-amber-600",

    name: "Level 4",

    subName: "Advanced Certification",

    course_id: 4,

    certificate_url: "",

    benefits: [
      "Elite certification status",

      "Premium industry access",

      "Advanced expertise recognition",
    ],
  },
];

const Certificate: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [generatingLevelId, setGeneratingLevelId] = useState<string | null>(null);

  const [levels, setLevels] = useState<Level[]>(INITIAL_LEVELS);

  useEffect(() => {
    const fetchExistingCertificates = async () => {
      const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
      if (!token) return;

      const updatedLevels = await Promise.all(
        INITIAL_LEVELS.map(async (level) => {
          if (!level.course_id) return level;
          try {
            const response = await fetch(
              `${API_BASE_URL}/student/scorecard/courses/${level.course_id}/certificate`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data && data.certificate_url) {
                return {
                  ...level,
                  certificate_url: data.certificate_url,
                  certificateId: data.certificate_no || level.certificateId,
                  certificateDbId: data.id,
                  issueDate: data.issued_at
                    ? new Date(data.issued_at).toLocaleDateString("en-GB")
                    : level.issueDate,
                };
              }
            }
          } catch (e) {
            console.warn(`Could not fetch certificate for course ${level.course_id}:`, e);
          }
          return level;
        })
      );

      setLevels(updatedLevels);
    };

    fetchExistingCertificates();
  }, []);

  const generateCertificate = async (level: Level): Promise<{ url: string; id: number; certificateNo: string } | null> => {
    if (!level.course_id) return null;
    
    setGeneratingLevelId(level.id);
    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login first");
        return null;
      }

      const response = await fetch(
        `${API_BASE_URL}/student/scorecard/courses/${level.course_id}/certificate/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(`Certificate generated successfully for ${level.name || level.title}!`);
        console.log("Certificate generated:", data);
        
        const certUrl = data.certificate_url || "";
        const certNo = data.certificate_no || level.certificateId || "";
        const certDbId = data.id;
        const issuedAtStr = data.issued_at 
          ? new Date(data.issued_at).toLocaleDateString("en-GB") 
          : level.issueDate || new Date().toLocaleDateString("en-GB");

        setLevels(prevLevels =>
          prevLevels.map(l =>
            l.id === level.id
              ? {
                  ...l,
                  certificate_url: certUrl,
                  certificateId: certNo,
                  certificateDbId: certDbId,
                  issueDate: issuedAtStr,
                }
              : l
          )
        );

        return { url: certUrl, id: certDbId, certificateNo: certNo };
      } else {
        const errData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to generate certificate";
        if (typeof errData.detail === "string") {
          errorMessage = errData.detail;
        } else if (Array.isArray(errData.detail) && errData.detail.length > 0) {
          errorMessage = errData.detail[0].msg || errorMessage;
        } else if (errData.message) {
          errorMessage = errData.message;
        }
        toast.error(errorMessage);
        console.error("Certificate generation error:", errData);
        return null;
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Failed to generate certificate. Please try again.");
      return null;
    } finally {
      setGeneratingLevelId(null);
    }
  };

  const handleViewCertificate = async (level: Level): Promise<void> => {
    console.log(`Viewing certificate for ${level.name || level.title}`);
    let certificateNo = level.certificateId;

    if (!certificateNo) {
      const res = await generateCertificate(level);
      if (res) {
        certificateNo = res.certificateNo;
      }
    }

    if (!certificateNo) {
      toast.error("Could not retrieve certificate number for verification.");
      return;
    }

    window.open(`${API_BASE_URL}/student/scorecard/verify/${certificateNo}`, "_blank");
  };

  const handleDownloadCertificate = async (level: Level): Promise<void> => {
    console.log(`Downloading certificate for ${level.name || level.title}`);
    let certificateDbId = level.certificateDbId;

    if (!certificateDbId) {
      const res = await generateCertificate(level);
      if (res) {
        certificateDbId = res.id;
      }
    }

    if (!certificateDbId) {
      toast.error("Could not retrieve certificate ID for download.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/student/scorecard/download/${certificateDbId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const downloadUrl = await response.json();
          if (downloadUrl && typeof downloadUrl === "string") {
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `Certificate_${level.title || "Level"}.pdf`);
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            toast.error("Failed to parse download link.");
          }
        } else {
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.setAttribute("download", `Certificate_${level.title || "Level"}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        }
      } else {
        toast.error("Failed to download certificate from server.");
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate. Please try again.");
    }
  };

  const handleUpgrade = (): void => {
    navigate("/upgrade");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-8 md:px-10 md:py-10">
        <button
          onClick={() => navigate("/studentdashboard")}
          className="flex items-center gap-2 text-sm mb-6 hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl md:text-3xl font-bold">Certifications & Levels</h1>
        <p className="text-sm opacity-90 mt-1">
          Track your certification journey and achievements
        </p>
      </div>

      <div className="max-w-7xl mx-auto mt-10 bg-white rounded-2xl shadow-md p-6 mx-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-6 flex items-center gap-2">
          📈 Certification Progress Timeline
        </h2>

        <div className="relative flex items-center justify-between px-2">
          {/* Progress Line */}
          <div className="absolute top-6 left-4 right-4 h-1 bg-gray-200"></div>

          {levels.map((level) => (
            <div
              key={level.id}
              className="relative z-10 flex flex-col items-center w-1/5"
            >
              {/* Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${level.color}`}
                style={
                  level.id === "L1"
                    ? {
                      background:
                        "linear-gradient(135deg, #10B981 0%, #00A63E 100%)",
                    }
                    : level.id === "L2"
                      ? {
                        background:
                          "linear-gradient(135deg, #3B82F6 0%, #155DFC 100%)",
                      }
                      : level.id === "L3"
                        ? {
                          background:
                            "linear-gradient(135deg, #F59E0B 0%, #F54900 100%)",
                        }
                        : {}
                }
              >
                <level.icon size={28} />
              </div>

              {/* Title */}
              <p className="mt-2 font-semibold text-gray-800">{level.title}</p>
              <p className="text-xs text-gray-500">{level.subtitle}</p>

              {/* Unlocked */}

              {level.status === "unlocked" && (
                <>
                  <div className="w-full h-1 bg-purple-800 mt-3 rounded"></div>
                  <p className="text-xs text-gray-500 mt-1">{level.exams}</p>
                  <span
                    className="mt-1 px-2 py-0.5 text-xs text-white rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #10B981 0%, #00A63E 100%)",
                    }}
                  >
                    Qualified
                  </span>
                </>
              )}

              {/* Locked */}

              {level.status === "locked" && (
                <span
                  className="mt-9 px-2 py-0.5 text-xs rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #FBBF24 0%, #D08700 100%)",
                  }}
                >
                  Premium
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto  mt-8  relative z-10">
        {/* Certification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {levels.map((level) => {
            const Icon = level.icon;

            return (
              <div
                key={level.id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg ${selectedLevel === level.id ? "ring-2 ring-blue-500" : ""
                  }`}
                onClick={() => setSelectedLevel(level.id)}
              >
                {/* Card Header */}
                <div
                  className={`p-6 rounded-t-xl flex items-center justify-between ${level.headerBg} text-white`}
                >
                  <div className="flex items-center">
                    <Icon className="w-6 h-6 mr-3" />
                    <div>
                      <h3 className="text-xl font-bold">{level.name}</h3>
                      <p className="text-sm opacity-90">{level.subName}</p>
                    </div>
                  </div>

                  {level.status === "unlocked" ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}
                </div>

                <div className="p-6">
                  {level.status === "unlocked" ? (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-lg mb-4">
                      <div className="flex items-center mb-2">
                        <Award className="w-5 h-5 mr-2" />
                        <p className="font-bold">Certificate Unlocked!</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Certificate ID:</span>
                          <span>{level.certificateId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Issue Date:</span>
                          <span>{level.issueDate}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg mb-4">
                      <div className="flex items-center mb-2">
                        <Award className="w-5 h-5 mr-2" />
                        <p className="font-bold">Premium Upgrade Required</p>
                      </div>
                      <p className="text-sm">
                        Upgrade to the Advanced plan to unlock this
                        certification level and gain access to premium security
                        expertise.
                      </p>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Benefits:
                    </h4>
                    <ul className="space-y-2">
                      {level.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start text-sm text-gray-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    {level.status === "unlocked" ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCertificate(level);
                          }}
                          disabled={generatingLevelId === level.id}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                        >
                          {generatingLevelId === level.id ? "Generating..." : "View"}
                          {generatingLevelId !== level.id && <ChevronRight className="w-4 h-4 ml-1" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadCertificate(level);
                          }}
                          disabled={generatingLevelId === level.id}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                        >
                          {generatingLevelId === level.id ? (
                            "Generating..."
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          handleUpgrade();
                        }}
                        className="w-full text-[#0F0F1E] py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(90deg, #FBBF24 0%, #D08700 100%)",
                        }}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Upgrade to Advanced
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
