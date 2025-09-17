import { CheckCircle, Shield, Mail, Phone, User, Briefcase } from "lucide-react";
import UserStore from "@/Store/UserStore";

const VerificationTab = () => {
  const userData = UserStore(state => state.user);

  if (!userData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  const verifications = [
    { 
      label: "Identity", 
      verified: userData.verification?.idVerified || false,
      icon: User,
      description: "Government-issued ID verification"
    },
    { 
      label: "Email address", 
      verified: userData.verification?.emailVerified || false,
      icon: Mail,
      description: "Email address confirmation"
    },
    { 
      label: "Phone number", 
      verified: userData.verification?.phoneVerified || false,
      icon: Phone,
      description: "Phone number verification"
    },
    { 
      label: "Work email", 
      verified: false, // This would need to be added to the user model
      icon: Briefcase,
      description: "Professional email verification"
    },
  ];

  const verifiedCount = verifications.filter(v => v.verified).length;
  const totalCount = verifications.length;
  const completionPercentage = Math.round((verifiedCount / totalCount) * 100);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Verification Status
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-medium text-blue-900">
            Trust & Safety
          </h3>
        </div>
        <p className="text-blue-800 mb-3">
          Verification helps build trust between hosts and guests. Complete your
          verification to increase booking confidence.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-blue-900">
            {verifiedCount}/{totalCount} completed ({completionPercentage}%)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {verifications.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.verified ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {item.verified ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <item.icon className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <span className="font-medium text-gray-900 block">{item.label}</span>
                <span className="text-sm text-gray-500">{item.description}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.verified ? (
                <span className="text-green-600 font-medium text-sm">Verified</span>
              ) : (
                <button className="text-rose-600 hover:text-rose-700 font-medium text-sm px-3 py-1 border border-rose-600 rounded hover:bg-rose-50 transition-colors">
                  Verify
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {verifiedCount === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">
            🚀 Get started with verification
          </h4>
          <p className="text-yellow-800 text-sm mb-3">
            Oops! You haven't completed any verifications yet. Start with email verification to build trust with potential guests.
          </p>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 transition-colors">
            Start Email Verification
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">
          Additional Verifications
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div>• Government ID verification (increases trust by 40%)</div>
          <div>• Background check (available in some regions)</div>
          <div>• Professional references (for business travelers)</div>
          <div>• Social media verification (LinkedIn, Facebook)</div>
        </div>
      </div>

      {completionPercentage === 100 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900">
              Congratulations! 🎉
            </h4>
          </div>
          <p className="text-green-800 text-sm">
            You've completed all basic verifications. Your profile now has enhanced credibility with potential guests.
          </p>
        </div>
      )}
    </div>
  );
};

export default VerificationTab;
