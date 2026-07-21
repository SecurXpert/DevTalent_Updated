import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  Clock,
  Eye,
  Download,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Atom,
  Box,
  Bot,
  Cloud,
  Palette,
  Database,
  Lock,
  Award,
} from "lucide-react";
import { API_BASE_URL } from "@/pages/Services/api/api";

interface Level {
  id: string;
  title: string;
  subtitle?: string;
  exams?: string;
  status: "qualified" | "locked" | "unlocked" | "issued" | "pending";
  icon?: React.ElementType;
  color?: string;
  headerBg?: string;
  bannerGradient?: string;
  name?: string;
  subName?: string;
  certificateId?: string;
  certTagId?: string;
  issueDate?: string;
  benefits?: string[];
  course_id?: number;
  certificate_url?: string;
  certificateDbId?: number;
}


const Certificate: React.FC = () => {
  const navigate = useNavigate();
  const [generatingLevelId, setGeneratingLevelId] = useState<string | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All Status" | "Issued" | "Pending">("All Status");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchExistingCertificates = async () => {
      const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
      if (!token) {
        setLoading(false);
        return;
      }

      // 1. Fetch student's current subscription to get selected courses in current plan
      let selectedCourseIds = new Set<number>();
      let selectedCourseList: { course_id: number; course_name?: string }[] = [];

      try {
        const subRes = await fetch(`${API_BASE_URL}/student/subscription/current`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (subRes.ok) {
          const subData = await subRes.json();
          let subs: any[] = [];
          if (Array.isArray(subData)) {
            subs = subData;
          } else if (subData && Array.isArray(subData.items)) {
            subs = subData.items;
          } else if (subData && Array.isArray(subData.data)) {
            subs = subData.data;
          } else if (subData) {
            subs = [subData];
          }

          subs.forEach((s: any) => {
            if (s.selected_courses && Array.isArray(s.selected_courses)) {
              s.selected_courses.forEach((c: any) => {
                if (c.course_id) {
                  const cId = Number(c.course_id);
                  selectedCourseIds.add(cId);
                  if (!selectedCourseList.some((x) => x.course_id === cId)) {
                    selectedCourseList.push({
                      course_id: cId,
                      course_name: c.course_name,
                    });
                  }
                }
              });
            }
          });
        }
      } catch (err) {
        console.warn("Could not fetch student subscription:", err);
      }

      let candidateCourses: Level[] = [];
      try {
        const coursesRes = await fetch(`${API_BASE_URL}/admin/catalog/courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          const list = Array.isArray(coursesData) ? coursesData : (coursesData.data || coursesData.items || []);
          list.forEach((c: any, index: number) => {
            const courseName = c.name || c.course_name || `Course ${c.id}`;
            candidateCourses.push({
              id: `COURSE_${c.id}`,
              title: courseName,
              name: courseName,
              subtitle: "Plan Certification",
              status: "pending",
              icon: [Atom, Box, Bot, Cloud, Palette, Database][index % 6],
              bannerGradient: [
                "from-[#7B3FE4] via-[#8B5CF6] to-[#A78BFA]",
                "from-[#059669] via-[#10B981] to-[#34D399]",
                "from-[#DC2626] via-[#EF4444] to-[#F87171]",
                "from-[#0284C7] via-[#06B6D4] to-[#38BDF8]",
                "from-[#DB2777] via-[#EC4899] to-[#F472B6]",
                "from-[#D97706] via-[#F59E0B] to-[#FBBF24]",
              ][index % 6],
              headerBg: "bg-gradient-to-r from-purple-500 to-indigo-600",
              certificateId: `CERT-${c.id}-001`,
              certTagId: `CERT-00${c.id}`,
              issueDate: "—",
              course_id: c.id,
              certificate_url: "",
            });
          });
        }
      } catch (err) {
        console.warn("Could not fetch catalog courses:", err);
      }

      // Fallback: If catalog endpoint fails or returns empty, construct candidates from subscription courses
      if (candidateCourses.length === 0) {
        selectedCourseList.forEach((sc, index) => {
          candidateCourses.push({
            id: `COURSE_${sc.course_id}`,
            title: sc.course_name || `Course ${sc.course_id}`,
            name: sc.course_name || `Course ${sc.course_id}`,
            subtitle: "Plan Certification",
            status: "pending",
            icon: [Atom, Box, Bot, Cloud, Palette, Database][index % 6],
            bannerGradient: [
              "from-[#7B3FE4] via-[#8B5CF6] to-[#A78BFA]",
              "from-[#059669] via-[#10B981] to-[#34D399]",
              "from-[#DC2626] via-[#EF4444] to-[#F87171]",
              "from-[#0284C7] via-[#06B6D4] to-[#38BDF8]",
              "from-[#DB2777] via-[#EC4899] to-[#F472B6]",
              "from-[#D97706] via-[#F59E0B] to-[#FBBF24]",
            ][index % 6],
            headerBg: "bg-gradient-to-r from-purple-500 to-indigo-600",
            certificateId: `CERT-${sc.course_id}-001`,
            certTagId: `CERT-00${sc.course_id}`,
            issueDate: "—",
            course_id: sc.course_id,
            certificate_url: "",
          });
        });
      }

      // 2. Query certificate endpoint for candidate courses and filter by requirement
      const evaluatedLevels = await Promise.all(
        candidateCourses.map(async (level) => {
          if (!level.course_id) return { level, keep: false };
          let isEarned = false;
          let updatedLevel = { ...level };

          try {
            const response = await fetch(
              `${API_BASE_URL}/student/scorecard/courses/${level.course_id}/certificate`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              console.log(`Backend certificate response for course ${level.course_id}:`, data);

              if (data && (data.certificate_url || data.certificate_no || data.id || data.status === "issued")) {
                isEarned = data.status === "issued" || !!data.certificate_no || !!data.certificate_url;
                const certNo = data.certificate_no || level.certificateId;
                const certDbId = data.id || level.certificateDbId;

                let formattedDate = level.issueDate;
                if (data.issued_at) {
                  const parsedDate = new Date(data.issued_at);
                  if (!isNaN(parsedDate.getTime())) {
                    formattedDate = parsedDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                  }
                }

                let certUrl = data.certificate_url || "";
                if (certUrl && !certUrl.startsWith("http")) {
                  certUrl = `${API_BASE_URL}${certUrl}`;
                }

                updatedLevel = {
                  ...level,
                  status: isEarned ? ("issued" as const) : ("pending" as const),
                  certificate_url: certUrl,
                  certificateId: certNo,
                  certificateDbId: certDbId,
                  issueDate: formattedDate,
                };
              }
            }
          } catch (e) {
            console.warn(`Could not fetch certificate for course ${level.course_id}:`, e);
          }

          const isSelectedInPlan = selectedCourseIds.has(level.course_id);
          // Keep ONLY if course is selected in current plan OR student already earned certificate for it
          const keep = isSelectedInPlan || isEarned;

          return { level: updatedLevel, keep };
        })
      );

      const filteredLevels = evaluatedLevels
        .filter((item) => item.keep)
        .map((item) => item.level);

      setLevels(filteredLevels);
      setLoading(false);
    };

    fetchExistingCertificates();
  }, []);

  const generateCertificate = async (
    level: Level
  ): Promise<{ url: string; id: number; certificateNo: string } | null> => {
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(`Certificate generated successfully for ${level.name || level.title}!`);
        console.log("Certificate generated backend response:", data);

        const certNo = data.certificate_no || level.certificateId || "";
        const certDbId = data.id || level.certificateDbId;

        let certUrl = data.certificate_url || "";
        if (certUrl && !certUrl.startsWith("http")) {
          certUrl = `${API_BASE_URL}${certUrl}`;
        }

        let issuedAtStr = level.issueDate;
        if (data.issued_at) {
          const parsedDate = new Date(data.issued_at);
          if (!isNaN(parsedDate.getTime())) {
            issuedAtStr = parsedDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          }
        } else {
          issuedAtStr = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }

        setLevels((prevLevels) =>
          prevLevels.map((l) =>
            l.id === level.id
              ? {
                  ...l,
                  status: "issued",
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
    let certificateDbId = level.certificateDbId;

    if (!certificateDbId || level.issueDate === "—" || !level.certificate_url) {
      const res = await generateCertificate(level);
      if (res) {
        certificateDbId = res.id;
      }
    }

    if (!certificateDbId) {
      certificateDbId = level.id.replace("COURSE_", "");
    }

    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const downloadUrl = `${API_BASE_URL}/student/scorecard/download/${certificateDbId}`;
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } else {
        toast.error("Failed to retrieve certificate from server.");
      }
    } catch (error) {
      console.error("Error viewing certificate:", error);
      toast.error("Failed to view certificate. Please try again.");
    }
  };

  const handleVerifyCertificate = async (level: Level): Promise<void> => {
    console.log(`Verifying certificate for ${level.name || level.title}`);
    let certificateNo = level.certificateId;

    if (!certificateNo || level.issueDate === "—" || !level.certificate_url) {
      const res = await generateCertificate(level);
      if (res) {
        certificateNo = res.certificateNo;
      }
    }

    if (!certificateNo) {
      toast.error("Could not retrieve certificate number for verification.");
      return;
    }

    const verifyUrl = `${API_BASE_URL}/student/scorecard/verify/${certificateNo}`;
    window.open(verifyUrl, "_blank");
  };

  const handleDownloadCertificate = async (level: Level): Promise<void> => {
    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const certId = level.certificateDbId || level.id.replace("COURSE_", "");
      const downloadUrl = `${API_BASE_URL}/student/scorecard/download/${certId}`;

      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const disposition = response.headers.get("content-disposition");
        if (disposition && disposition.indexOf("attachment") !== -1) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
          let filename = `Certificate_${level.title || "Level"}.pdf`;
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, "");
          }
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            if (data && data.download_url) {
              let absoluteUrl = data.download_url;
              if (!absoluteUrl.startsWith("http")) {
                absoluteUrl = `${API_BASE_URL}${absoluteUrl}`;
              }
              const link = document.createElement("a");
              link.href = absoluteUrl;
              link.setAttribute("download", `Certificate_${level.title || "Level"}.pdf`);
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
        }
      } else {
        toast.error("Failed to download certificate from server.");
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate. Please try again.");
    }
  };

  const isIssued = (level: Level) => {
    return level.status === "issued" || (level.issueDate && level.issueDate !== "—");
  };

  const filteredLevels = levels.filter((level) => {
    const matchesSearch =
      (level.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (level.certificateId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (level.certTagId || "").toLowerCase().includes(searchTerm.toLowerCase());

    const issued = isIssued(level);

    if (statusFilter === "Issued") return matchesSearch && issued;
    if (statusFilter === "Pending") return matchesSearch && !issued;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F9] flex flex-col font-sans">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-8 md:px-10 md:py-10">
        <button
          onClick={() => navigate("/studentdashboard")}
          className="flex items-center gap-2 text-sm mb-6 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl md:text-3xl font-bold">My Certificates</h1>
        <p className="text-sm opacity-90 mt-1">
          View your earned certificates, verify credentials, and download official PDF scorecards.
        </p>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 py-8 space-y-6 flex-1">
        {/* TOP SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search input (full width or flex-1, removed back button since it's in header) */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by course, certificate no. or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-full text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-auto flex justify-end">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full sm:w-auto flex items-center justify-between gap-2 px-5 py-2.5 bg-white border border-slate-200/80 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm transition-all"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-600" />
                <span>{statusFilter}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-12 w-44 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {(["All Status", "Issued", "Pending"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors ${
                      statusFilter === status
                        ? "bg-purple-50 text-purple-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{status}</span>
                    {statusFilter === status && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CERTIFICATE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLevels.map((level) => {
            const IconComponent = level.icon || Award;
            const issued = isIssued(level);

            return (
              <div
                key={level.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100/80 flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                {/* CARD HEADER BANNER */}
                <div
                  className={`rounded-2xl h-44 flex flex-col items-center justify-center relative overflow-hidden text-white shadow-inner mb-4 bg-gradient-to-tr ${
                    level.bannerGradient || "from-purple-500 via-indigo-500 to-purple-600"
                  }`}
                >
                  {/* Decorative background circles */}
                  <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-[1px] pointer-events-none" />
                  <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/15 rounded-full blur-[1px] pointer-events-none" />

                  {/* Top-Right Badge */}
                  <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>

                  {/* Center Icon Bubble */}
                  <div className="w-13 h-13 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg mb-2 text-white p-3">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Certificate Text */}
                  <span className="text-[10px] font-extrabold tracking-[0.25em] text-white/90 uppercase">
                    CERTIFICATE
                  </span>
                </div>

                {/* CARD BODY CONTENT */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="text-base font-bold text-slate-800 line-clamp-1">
                        {level.title}
                      </h3>

                      {issued ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Issued
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center gap-1 shrink-0">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          Pending
                        </span>
                      )}
                    </div>

                    {/* Metadata Table / Key-Values */}
                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Cert No.</span>
                        <span className="font-bold text-indigo-700 font-mono">
                          {level.certificateId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Issued</span>
                        <span className="font-semibold text-slate-600">
                          {level.issueDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Course ID</span>
                        <span className="font-semibold text-slate-600 font-mono">
                          {level.course_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Divider */}
                    <div className="border-t border-slate-100 my-3.5" />

                    {/* Action Buttons Row */}
                    <div className="flex items-center gap-2">
                      {issued ? (
                        <>
                          <button
                            onClick={() => handleViewCertificate(level)}
                            disabled={generatingLevelId === level.id}
                            className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                          >
                            <Eye className="w-4 h-4" />
                            {generatingLevelId === level.id ? "Generating..." : "View"}
                          </button>
                          <button
                            onClick={() => handleDownloadCertificate(level)}
                            disabled={generatingLevelId === level.id}
                            title="Download Certificate"
                            className="w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] flex items-center justify-center transition-all shrink-0 active:scale-95 disabled:opacity-50"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleVerifyCertificate(level)}
                            title="Verify Certificate"
                            className="w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] flex items-center justify-center transition-all shrink-0 active:scale-95"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleViewCertificate(level)}
                          disabled={generatingLevelId === level.id}
                          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4" />
                          {generatingLevelId === level.id ? "Generating..." : "Generate Certificate"}
                        </button>
                      )}
                    </div>
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

