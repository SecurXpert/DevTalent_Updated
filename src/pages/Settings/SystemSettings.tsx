import React, { useState } from "react";
import { FaShieldAlt, FaClock, FaSave } from "react-icons/fa";
import AdvancedSettings from "./AdvancedSettings";

const SystemSettings: React.FC = () => {
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(false);
  const [screen, setScreen] = useState(true);

  const [duration, setDuration] = useState(120);
  const [passing, setPassing] = useState(60);
  const [grace, setGrace] = useState(5);
  const [autoSubmit, setAutoSubmit] = useState("");

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    const settings = {
      proctoring: { camera, mic, screen },
      examDefaults: { duration, passing, grace, autoSubmit },
    };
    localStorage.setItem("systemSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      setCamera(true);
      setMic(false);
      setScreen(true);
      setDuration(120);
      setPassing(60);
      setGrace(5);
      setAutoSubmit("");
      localStorage.removeItem("systemSettings");
      alert("Settings reset to defaults!");
    }
  };

  const Toggle = ({
    enabled,
    setEnabled,
  }: {
    enabled: boolean;
    setEnabled: (val: boolean) => void;
  }) => (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
        enabled ? "bg-indigo-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <div className="px-4 sm:px-6 py-6 bg-gray-100 min-h-screen space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">System Settings</h1>
        <p className="text-gray-500">
          Configure platform settings and preferences
        </p>
      </div>

      {/* PROCTORING SETTINGS */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold">
              Proctoring Settings
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Configure exam monitoring features
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Camera */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base">
                Camera Proctoring
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Require students to enable camera during exams
              </p>
            </div>
            <Toggle enabled={camera} setEnabled={setCamera} />
          </div>

          {/* Mic */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base">
                Microphone Monitoring
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Monitor audio during exams
              </p>
            </div>
            <Toggle enabled={mic} setEnabled={setMic} />
          </div>

          {/* Screen */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base">
                Screen Recording
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Record student screens during exams
              </p>
            </div>
            <Toggle enabled={screen} setEnabled={setScreen} />
          </div>
        </div>
      </div>

      {/* DEFAULT EXAM SETTINGS */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border shadow-sm">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <FaClock className="w-5 h-5 sm:w-6 sm:h-6 text-[#155DFC]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold">
              Default Exam Settings
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Set default values for new exams
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-600">
              Default Exam Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Default Passing Score (%)
            </label>
            <input
              type="number"
              value={passing}
              onChange={(e) => setPassing(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Grace Period (minutes)
            </label>
            <input
              type="number"
              value={grace}
              onChange={(e) => setGrace(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Extra time after exam ends for submission
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Auto-submit After</label>
            <input
              type="text"
              value={autoSubmit}
              onChange={(e) => setAutoSubmit(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        </div>

        {/* OPTIONS */}
        <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          <div>
            <p className="font-medium text-sm sm:text-base">
              Randomize Questions by Default
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Show questions in random order
            </p>
          </div>

          <div>
            <p className="font-medium text-sm sm:text-base">
              Allow Students to Review Answers
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Let students review their answers before final submission
            </p>
          </div>

          <div>
            <p className="font-medium text-sm sm:text-base">
              Show Results After Submission
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Display results immediately after exam
            </p>
          </div>
        </div>
      </div>
      <AdvancedSettings
        onSaveSettings={handleSaveSettings}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
};

export default SystemSettings;
