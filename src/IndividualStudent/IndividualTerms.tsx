import React, { useState, useRef, useEffect } from "react";
import { Camera, Mic } from "lucide-react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";

const IndividualTerms: React.FC = () => {
  const navigate = useNavigate();
  const { courseId: routeCourseId } = useParams<{ courseId?: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const queryCourseId = searchParams.get("courseId");
  const stateCourseId = (location.state as any)?.courseId;
  const localCourseId = localStorage.getItem("selectedCourseId");
  
  // Layered courseId resolution
  const courseId = routeCourseId || queryCourseId || stateCourseId || localCourseId || "1";

  // Store resolved course ID to local storage
  useEffect(() => {
    if (courseId) {
      localStorage.setItem("selectedCourseId", courseId);
    }
  }, [courseId]);

  const [studentEmail, setStudentEmail] = useState<string>("Loading...");

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) {
          setStudentEmail("Guest");
          return;
        }

        let studentId = "";
        let emailFromToken = "";
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          studentId = String(payload.user_id || payload.id || payload.candidate_id || payload.sub || "");
          emailFromToken = payload.email || payload.email_id || "";
        } catch (e) {
          console.error("Error decoding token", e);
        }

        if (emailFromToken) {
          setStudentEmail(emailFromToken);
        } else if (studentId) {
          // Fallback: fetch from API
          const response = await fetch(`${API_BASE_URL}/student/students/${studentId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setStudentEmail(data.email_id || data.email || "Unknown User");
          } else {
            setStudentEmail("Unknown User");
          }
        } else {
          setStudentEmail("Unknown User");
        }
      } catch (error) {
        console.error("Error fetching student email:", error);
        setStudentEmail("Unknown User");
      }
    };
    fetchEmail();
  }, []);

  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [micAllowed, setMicAllowed] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);

  const [accepted, setAccepted] = useState(false);

  // ensure video plays after stream set
  const attachStream = async (stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      try {
        await videoRef.current.play();
      } catch (e) {
        console.error("Video play error:", e);
      }
    }
  };

  const requestCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream); // store stream
      setCameraAllowed(true);
    } catch (err) {
      console.error(err);
      alert("Camera permission denied or not supported");
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => console.error("Play error:", err));
    }
  }, [stream]);

  const requestMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicAllowed(true);
    } catch (err) {
      alert("Microphone permission denied");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 py-10 px-4">
      <div className="max-w-5xl mx-auto text-white text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome to DevTalent Exam Platform
        </h1>
        <p className="mt-2 text-sm md:text-base opacity-90">
          Welcome, {studentEmail}
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
          Terms & Conditions
        </h2>

        <div className="bg-gray-50 border rounded-xl p-5 text-gray-700 text-sm space-y-6 max-h-[300px] overflow-y-auto">
          <div>
            <h3 className="font-semibold mb-2">1. Exam Integrity</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                You will not use any unauthorized materials during the exam
              </li>
              <li>You will not communicate with others during the exam</li>
              <li>Your camera and microphone will remain active throughout</li>
              <li>
                AI monitoring will track your activities for security purposes
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Privacy & Data Collection</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Video and audio recordings for proctoring</li>
              <li>Screen activity and eye tracking data</li>
              <li>Answer submissions and timing information</li>
              <li>System information and browser metadata</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Technical Requirements</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Stable internet connection required</li>
              <li>Working webcam and microphone mandatory</li>
              <li>Modern browser (Chrome, Firefox, Safari, Edge)</li>
              <li>
                No browser extensions or plugins that interfere with the exam
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4. Exam Rules</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Time limits are strictly enforced</li>
              <li>Once submitted, answers cannot be changed</li>
              <li>Suspicious activity may result in disqualification</li>
              <li>Technical issues should be reported immediately</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">5. Results & Scoring</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Results will be available after exam completion</li>
              <li>Automated grading for MCQs and coding questions</li>
              <li>Manual review may be conducted for flagged submissions</li>
            </ul>
          </div>
        </div>

        <h3 className="text-purple-700 font-semibold mt-8 mb-4">
          Optional permissions (Recommended for proctored Exams)
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera */}
          <div className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Camera Preview</h4>
              <Camera className="w-5 h-5 text-gray-500" />
            </div>

            <div className="bg-gray-300 h-40 rounded-lg overflow-hidden flex items-center justify-center text-gray-600 text-sm text-center px-3">
              <div className="relative w-full h-full">
                {/* Video always present */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Overlay text when camera OFF */}
                {!cameraAllowed && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm text-center px-3 bg-gray-300">
                    Position your face clearly in front of the camera to scan
                    your photo.
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={requestCamera}
              className="mt-4 w-full py-2 rounded-lg text-white font-medium"
              style={{
                background: "linear-gradient(to right, #7e22ce, #9333ea)",
              }}
            >
              {cameraAllowed ? "Camera Enabled" : "Allow Camera"}
            </button>
          </div>

          {/* Microphone */}
          <div className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Microphone Access</h4>
              <Mic className="w-5 h-5 text-gray-500" />
            </div>

            <div className="bg-gray-300 h-40 rounded-lg flex items-center justify-center text-gray-600 text-sm">
              Microphone will be used during the exam
            </div>

            <button
              onClick={requestMic}
              className="mt-4 w-full py-2 rounded-lg text-white font-medium"
              style={{
                background: "linear-gradient(to right, #7e22ce, #9333ea)",
              }}
            >
              {micAllowed ? "Microphone Enabled" : "Allow Microphone"}
            </button>
          </div>
        </div>
        {/* Agreement Section */}
        {/* Agreement Section */}
        <div className="mt-8">
          <label className="flex items-start gap-3 bg-purple-50 p-4 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 accent-purple-600 cursor-pointer"
            />
            <span className="text-gray-700 text-sm">
              I have read the terms and conditions. I understand that the exam
              will be monitored and recorded.
            </span>
          </label>

          {/* Start Exam Button */}
          <button
            onClick={() => navigate(`/individualoverview/${courseId}`)}
            disabled={!accepted}
            className={`w-full mt-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
              accepted
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndividualTerms;
