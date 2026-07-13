import React from "react";

import {
  ChevronLeft,
  Crown,
  Medal,
  Sparkles,
  TrendingUp,
  Check,
  CheckCircle,
  Shield,
  Zap,
  Star,
} from "lucide-react";

const UpgradePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-600 text-black p-6">
        <div className="max-w-5xl mx-auto">
          <button className="flex items-center text-sm mb-3">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <Crown className="w-7 h-7" />
            <div>
              <h1 className="text-2xl font-bold">Upgrade to Advanced</h1>
              <p className="text-sm">
                Unlock premium features and advanced certification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-200">
          {/* Top Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-8 relative">
            <div className="text-sm font-medium bg-yellow-200 inline-block px-3 py-1 rounded-full mb-4">
              <Star className="inline w-3 h-3 mr-1" /> Most Popular Upgrade
            </div>

            <h1 className="text-3xl font-bold mb-2">Advanced Premium Plan</h1>

            <p className="text-sm mb-6 text-black/80">
              Everything you need to excel
            </p>

            <div className="flex items-end gap-4">
              <h2 className="text-5xl font-bold">₹1,499</h2>
              <div className="text-sm">
                <p>+ GST (₹270)</p>
                <p className="font-semibold">Total: ₹1,769</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 bg-gray-50">
            <h2 className="text-lg font-semibold mb-6">
              <Sparkles className="inline w-4 h-4 mr-2" /> What's Included
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Premium Features */}
              <div>
                <h3 className="text-purple-600 font-semibold mb-4">
                  Premium Features
                </h3>
                <ul className="space-y-3 text-sm">
                  {[
                    "L4 Advanced Certification",
                    "15 Premium Exams",
                    "Advanced Analytics Dashboard",
                    "Priority Support",
                    "Lifetime Certificate Validity",
                    "Industry Recognition Badge",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Benefits */}
              <div>
                <h3 className="text-purple-600 font-semibold mb-4">
                  Additional Benefits
                </h3>
                <ul className="space-y-3 text-sm">
                  {[
                    "Extended Validity (730 days)",
                    "Personalized Learning Path",
                    "Expert Mentor Sessions",
                    "Resume Highlight Support",
                    "LinkedIn Certification Badge",
                    "Career Advancement Resources",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Comparison Section */}
            <div className="mt-10 bg-gray-100 rounded-xl p-6">
              <h4 className="text-sm font-semibold mb-4">How it Compares</h4>

              <div className="grid grid-cols-3 text-center text-sm">
                <div>
                  <p className="text-gray-500">6</p>
                  <p>Exams</p>
                </div>
                <div>
                  <p className="text-gray-500">L1-L3</p>
                  <p>Levels</p>
                </div>
                <div>
                  <p className="text-gray-500">365</p>
                  <p>Days</p>
                </div>
              </div>

              <div className="border-t my-4"></div>

              <div className="grid grid-cols-3 text-center text-sm">
                <div>
                  <p className="text-yellow-600 font-bold">15</p>
                  <p>Exams</p>
                </div>
                <div>
                  <p className="text-yellow-600 font-bold">L1-L4</p>
                  <p>Levels</p>
                </div>
                <div>
                  <p className="text-yellow-600 font-bold">730</p>
                  <p>Days</p>
                </div>
              </div>
            </div>

            {/* Upgrade Button */}
            <button className="w-full mt-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl transition">
              <Crown className="inline w-4 h-4 mr-2" /> Upgrade Now for ₹1,769{" "}
              <Zap className="inline w-4 h-4 ml-2" />
            </button>

            {/* Footer Info */}
            <div className="flex justify-center gap-6 text-xs text-gray-500 mt-4">
              <span>
                <Shield className="inline w-4 h-4 " /> Secure Payment
              </span>
              <span>
                <Zap className="inline w-3 h-3 mr-1" /> Instant Activation
              </span>
            </div>

            {/* Testimonial */}
            <div className="mt-8 bg-gradient-to-r from-purple-200 to-purple-300 p-6 rounded-xl text-sm">
              <p className="italic mb-2">
                "The Advanced Premium plan helped me stand out in job
                interviews. The L4 certification added significant value to my
                resume!"
              </p>
              <p className="font-semibold">- Priya S., Software Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;

  title: string;

  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,

  title,

  desc,
}) => (
  <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">
    <div className="w-10 h-10 mx-auto mb-3 text-yellow-600">{icon}</div>
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

interface ListItemProps {
  text: string;
}

const ListItem: React.FC<ListItemProps> = ({ text }) => (
  <li className="flex items-start gap-2">
    <Check className="w-4 h-4 text-green-500 mt-1" />

    {text}
  </li>
);

export default UpgradePage;
