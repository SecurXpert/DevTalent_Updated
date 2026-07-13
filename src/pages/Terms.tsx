
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Mic, CheckCircle2, CameraOff } from "lucide-react";
import { toast } from "sonner";
 
const Terms = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [showSubmittedAlert, setShowSubmittedAlert] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
 
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/");
    }
  }, [navigate]);
 
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
 
  const requestCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      (window as any).cameraStream = mediaStream;
      setStream(mediaStream);
      setCameraGranted(true);
      toast.success("Camera access granted");
    } catch (error) {
      toast.error("Camera access denied. Please enable camera to continue.");
    }
  };
 
  const requestMicrophone = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      (window as any).micStream = mediaStream;
      setMicGranted(true);
      toast.success("Microphone access granted");
    } catch (error) {
      toast.error("Microphone access denied. Please enable microphone to continue.");
    }
  };
 
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        setCapturedPhoto(dataURL);
        setPhotoCaptured(true);
        localStorage.setItem("capturedIdentificationPhoto", dataURL);
        toast.success("Photo captured successfully");
      }
    }
  };
 
  // UPDATED: restart camera + clear canvas when retaking
  const handleRetake = async () => {
    setPhotoCaptured(false);
    setCapturedPhoto(null);
 
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
 
    // re-request / restart the camera so live preview appears again
    await requestCamera();
 
    toast.info("Ready to capture new photo");
  };
 
  const canStartExam = agreed;
 
  const handleStartExam = async () => {
    if (!canStartExam) return;
 
    const userEmail = localStorage.getItem("userEmail");
 
    navigate("/overview", {
      state: {
        email: userEmail,
        attemptData: null,
        compilerQuestions: [],
      },
    });
  };
 
  return (
    <div className="min-h-screen" style={{ background: "#CA7BD9" }}>
      {showSubmittedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-center">
              Already Submitted
            </h3>
            <p className="mb-4 text-center text-muted-foreground">
              You have already submitted this exam.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Success Page
            </Button>
          </div>
        </div>
      )}
 
      <div className="flex flex-col items-center pt-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to DevTalent Exam Platform
        </h1>
        <p className="text-white text-lg mb-8">
          Welcome,{" "}
          {localStorage.getItem("userEmail") ||
            "snehadugram1230@gmail.com"}
        </p>
 
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
          <div className="p-8 space-y-8">
            {/* Terms & Conditions with Scroller - FULL ORIGINAL CONTENT */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Terms & Conditions
              </h3>
              <div
                className="bg-gray-100 rounded-lg p-6 border border-gray-300 overflow-y-auto"
                style={{ height: "260px" }}
              >
                <div className="space-y-6 text-sm text-gray-700">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      1. Exam Integrity
                    </h4>
                    <p className="mb-2">By proceeding, you agree that:</p>
                    <ul className="list-disc ml-8 space-y-1">
                      <li>
                        You will not use any unauthorized materials during the
                        exam
                      </li>
                      <li>
                        You will not communicate with others during the exam
                      </li>
                      <li>
                        Your camera and microphone will remain active
                        throughout
                      </li>
                      <li>
                        AI monitoring will track your activities for security
                        purposes
                      </li>
                    </ul>
                  </div>
 
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      2. Privacy & Data Collection
                    </h4>
                    <p className="mb-2">
                      We collect the following data during your exam:
                    </p>
                    <ul className="list-disc ml-8 space-y-1">
                      <li>Video and audio recordings for proctoring</li>
                      <li>Screen activity and eye tracking data</li>
                      <li>Answer submissions and timing information</li>
                      <li>System information and browser metadata</li>
                    </ul>
                  </div>
 
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      3. Technical Requirements
                    </h4>
                    <ul className="list-disc ml-8 space-y-1">
                      <li>Stable internet connection required</li>
                      <li>Working webcam and microphone mandatory</li>
                      <li>
                        Modern browser (Chrome, Firefox, Safari, Edge)
                      </li>
                      <li>
                        No browser extensions or plugins that interfere with the
                        exam
                      </li>
                    </ul>
                  </div>
 
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      4. Exam Rules
                    </h4>
                    <ul className="list-disc ml-8 space-y-1">
                      <li>Time limits are strictly enforced</li>
                      <li>Once submitted, answers cannot be changed</li>
                      <li>
                        Suspicious activity may result in disqualification
                      </li>
                      <li>
                        Technical issues should be reported immediately
                      </li>
                    </ul>
                  </div>
 
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      5. Results & Scoring
                    </h4>
                    <ul className="list-disc ml-8 space-y-1">
                      <li>
                        Results will be available after exam completion
                      </li>
                      <li>
                        Automated grading for MCQs and coding questions
                      </li>
                      <li>
                        Manual review may be conducted for flagged submissions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Optional Permissions */}
            <div>
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: "#961BAC" }}
              >
                Optional permissions (Recommended for proctored Exams)
              </h3>
 
              {/* Only Camera Preview + Microphone Access */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Camera Preview (with Allow Camera + live scanning + captured display) */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-800">
                      Camera Preview
                    </span>
                    {cameraGranted && (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                  </div>
 
                  {/* Live Preview / Placeholder */}
                  <div className="bg-gray-400 aspect-video rounded mb-4 flex items-center justify-center overflow-hidden">
                    {stream && !photoCaptured ? (
                      <video
                        autoPlay
                        muted
                        playsInline
                        ref={videoRef}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : capturedPhoto && photoCaptured ? (
                      <img
                        src={capturedPhoto}
                        alt="Scanned"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-500 rounded flex flex-col items-center justify-center space-y-2">
                        <CameraOff className="w-12 h-12 text-gray-200" />
                        <p className="text-xs text-gray-100 px-4 text-center">
                          Position your face clearly in front of the camera to
                          scan your photo.
                        </p>
                      </div>
                    )}
                  </div>
 
                  {/* Controls: Allow Camera + Scan / Retake */}
                  <div className="space-y-2">
                    <Button
                      onClick={requestCamera}
                      disabled={cameraGranted}
                      className="w-full text-white font-medium"
                      style={{
                        backgroundColor: cameraGranted ? "#cccccc" : "#961BAC",
                      }}
                    >
                      {cameraGranted ? "Camera Enabled" : "Allow Camera"}
                    </Button>
 
                    {cameraGranted && (
                      <>
                        {!photoCaptured ? (
                          <Button
                            onClick={capturePhoto}
                            disabled={!stream}
                            className="w-full text-white font-medium"
                            style={{ backgroundColor: "#961BAC" }}
                          >
                            Scan & Capture Photo
                          </Button>
                        ) : (
                          <Button
                            onClick={handleRetake}
                            variant="outline"
                            className="w-full font-medium"
                          >
                            Retake Scan
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
 
                {/* Microphone Access */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-800">
                      Microphone Access
                    </span>
                    <Mic className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="bg-gray-400 aspect-video rounded mb-4" />
                  <Button
                    onClick={requestMicrophone}
                    disabled={micGranted}
                    className="w-full text-white font-medium"
                    style={{
                      backgroundColor: micGranted ? "#cccccc" : "#961BAC",
                    }}
                  >
                    {micGranted ? "Microphone Enabled" : "Allow Microphone"}
                  </Button>
                </div>
              </div>
 
              {/* Hidden canvas for scanning */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
 
            {/* Agreement Checkbox */}
            <div className="flex items-start space-x-3 mt-8 bg-purple-50 p-4 rounded-lg">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) =>
                  setAgreed(checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 cursor-pointer leading-relaxed"
              >
                I have read the terms and conditions. I understand that the
                exam will be monitored and recorded.
              </label>
            </div>
 
            {/* Start Exam Button */}
            <div className="mt-10">
              <Button
                onClick={handleStartExam}
                disabled={!canStartExam}
                className="w-full text-white text-lg py-6 font-semibold rounded-lg"
                style={{
                  background: canStartExam
                    ? "linear-gradient(to right, #961BAC, #3D0B46)"
                    : "#cccccc",
                  cursor: canStartExam ? "pointer" : "not-allowed",
                }}
              >
                Start Exam
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Terms;