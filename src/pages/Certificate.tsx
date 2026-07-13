import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
}

const Certificate: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const levels: Level[] = [
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

      benefits: [
        "Elite certification status",

        "Premium industry access",

        "Advanced expertise recognition",
      ],
    },
  ];

  const handleViewCertificate = (level: Level): void => {
    console.log(`Viewing certificate for ${level.name}`);
  };

  const handleDownloadCertificate = (level: Level): void => {
    console.log(`Downloading certificate for ${level.name}`);
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
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          View
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            handleDownloadCertificate(level);
                          }}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
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
