import React from "react";
import {
  FaBell,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";

type NotificationItem = {
  id: number;
  title: string;
  type: string;
  message: string;
  audience: string;
  date: string;
};

type NotificationDetailsModalProps = {
  notification: NotificationItem | null;
  isOpen: boolean;
  onClose: () => void;
};

const NotificationDetailsModal: React.FC<NotificationDetailsModalProps> = ({
  notification,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">
            Notification Details
          </h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:opacity-80"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* TYPE BADGE */}
          <div>
            <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
              <FaBell className="w-4 h-4" /> {notification.type}
            </span>
          </div>

          {/* TITLE */}
          <div>
            <p className="text-gray-500 text-sm mb-1">Title</p>
            <h3 className="text-2xl font-semibold">{notification.title}</h3>
          </div>

          {/* MESSAGE */}
          <div>
            <p className="text-gray-500 text-sm mb-2">Message</p>
            <div className="border rounded-xl p-4 bg-gray-50 text-gray-700">
              {notification.message}
            </div>
          </div>

          {/* GRID INFO */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* RECIPIENTS */}
            <div className="border rounded-xl p-4 bg-indigo-50">
              <p className="text-[#155DFC] text-sm mb-1 flex items-center gap-2">
                <FaUsers className="w-4 h-4" /> Recipients
              </p>
              <p className="text-indigo-700 font-semibold">
                {notification.audience}
              </p>
            </div>

            {/* SENT AT */}
            <div className="border rounded-xl p-4 bg-purple-50">
              <p className="text-[#9810FA] text-sm mb-1 flex items-center gap-2">
                <FaClock className="w-4 h-4" /> Sent At
              </p>
              <p className="text-purple-700 font-semibold">
                {notification.date}
              </p>
            </div>

            {/* DELIVERY STATUS */}
            <div className="border rounded-xl p-4 bg-green-50">
              <p className="text-[#00A63E] text-sm mb-1 flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4" /> Delivery Status
              </p>
              <p className="text-green-700 font-semibold">
                Successfully Delivered
              </p>
            </div>

            {/* READ RATE */}
            <div className="border rounded-xl p-4 bg-indigo-50">
              <p className="text-[#4F39F6] text-sm mb-1 flex items-center gap-2">
                <FaBell className="w-4 h-4" /> Read Rate
              </p>
              <p className="text-indigo-700 font-semibold">
                87% (2,477 / 2,847)
              </p>
            </div>
          </div>

          {/* CHANNELS */}
          <div>
            <p className="text-gray-500 text-sm mb-3">Notification Channels</p>

            <div className="flex gap-3 flex-wrap">
              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4 text-green-600" /> Email Sent
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4 text-green-600" /> Push
                Notification
              </span>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button onClick={onClose} className="px-6 py-2 rounded-lg border">
              Close
            </button>

            <button className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2">
              <FaPaperPlane className="w-4 h-4" /> Resend Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailsModal;
