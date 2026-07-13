import React, { useState } from "react";
import { FaCode, FaLock, FaShieldAlt, FaSave } from "react-icons/fa";

type AdvancedSettingsProps = {
  onSaveSettings: () => void;
  onResetToDefaults: () => void;
};

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  onSaveSettings,
  onResetToDefaults,
}) => {
  const [timeout, setTimeoutVal] = useState(10);
  const [memory, setMemory] = useState(256);

  const [security, setSecurity] = useState({
    twoFA: false,
    tabSwitch: false,
    ip: false,
    copyPaste: false,
  });

  const [emailSettings, setEmailSettings] = useState({
    registration: true,
    reminders: true,
    results: true,
  });

  return (
    <div className=" py-6 bg-gray-100 min-h-screen space-y-6">
      {/* CODING SETTINGS */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <FaCode className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold">
              Coding Environment Settings
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Configure code editor and execution settings
            </p>
          </div>
        </div>

        {/* LANGUAGES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6 text-gray-700">
          <div className="space-y-2">
            <p className="text-sm sm:text-base">Python</p>
            <p className="text-sm sm:text-base">C</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm sm:text-base">Java</p>
            <p className="text-sm sm:text-base">Ruby</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm sm:text-base">C++</p>
            <p className="text-sm sm:text-base">Go</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm sm:text-base">JavaScript</p>
            <p className="text-sm sm:text-base">Rust</p>
          </div>
        </div>

        {/* INPUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
          <div>
            <label className="text-sm text-gray-600">
              Code Execution Timeout (seconds)
            </label>
            <input
              type="number"
              value={timeout}
              onChange={(e) => setTimeoutVal(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Memory Limit (MB)</label>
            <input
              type="number"
              value={memory}
              onChange={(e) => setMemory(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        </div>

        {/* OPTIONS */}
        <div className="space-y-3 sm:space-y-4 text-gray-700">
          <div>
            <p className="font-medium text-sm sm:text-base">
              Enable Code Auto-save
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Automatically save code every 30 seconds
            </p>
          </div>

          <div>
            <p className="font-medium text-sm sm:text-base">
              Syntax Highlighting
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Enable syntax highlighting in code editor
            </p>
          </div>
        </div>
      </div>

      {/* SECURITY SETTINGS */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <FaLock className="w-5 h-5 sm:w-6 sm:h-6 text-[#E7000B]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold">
              Security Settings
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Platform security and access control
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {[
            {
              key: "twoFA",
              title: "Require Two-Factor Authentication",
              desc: "Force 2FA for all admin accounts",
            },
            {
              key: "tabSwitch",
              title: "Block Tab Switching",
              desc: "Prevent students from switching browser tabs during exams",
            },
            {
              key: "ip",
              title: "IP Restriction",
              desc: "Restrict exam access to specific IP addresses",
            },
            {
              key: "copyPaste",
              title: "Copy-Paste Prevention",
              desc: "Disable copy-paste during exams (except code editor)",
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={security[item.key as keyof typeof security]}
                onChange={() =>
                  setSecurity({
                    ...security,
                    [item.key]: !security[item.key as keyof typeof security],
                  })
                }
                className="mt-1 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">{item.title}</p>
                <p className="text-xs sm:text-sm text-gray-500">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* EMAIL SETTINGS */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold">
              Email & Notification Settings
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Configure automatic notifications
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {[
            {
              key: "registration",
              title: "Email Registration Confirmation",
              desc: "Send confirmation email to new students",
            },
            {
              key: "reminders",
              title: "Exam Reminder Notifications",
              desc: "Automatically send reminders 24h before exams",
            },
            {
              key: "results",
              title: "Result Publication Alerts",
              desc: "Notify students when results are available",
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={emailSettings[item.key as keyof typeof emailSettings]}
                onChange={() =>
                  setEmailSettings({
                    ...emailSettings,
                    [item.key]:
                      !emailSettings[item.key as keyof typeof emailSettings],
                  })
                }
                className="mt-1 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">{item.title}</p>
                <p className="text-xs sm:text-sm text-gray-500">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={onSaveSettings}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow flex items-center justify-center gap-2 w-full sm:w-auto hover:from-indigo-700 hover:to-purple-700 transition"
        >
          <FaSave className="w-4 h-4" /> Save All Settings
        </button>

        <button
          onClick={onResetToDefaults}
          className="border px-6 py-2 rounded-lg w-full sm:w-auto hover:bg-gray-50 transition"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default AdvancedSettings;
