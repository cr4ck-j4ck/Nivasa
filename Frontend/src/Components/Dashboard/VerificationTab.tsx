import { CheckCircle, Shield } from "lucide-react";
import { verifications } from "./Data/verification";

const VerificationTab = () => {
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
        <p className="text-blue-800">
          Verification helps build trust between hosts and guests. Complete your
          verification to increase booking confidence.
        </p>
      </div>

      <div className="space-y-4">
        {verifications.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  item.verified ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {item.verified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <div className="w-4 h-4 border border-gray-400 rounded-full" />
                )}
              </div>
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            {!item.verified && (
              <button className="text-rose-600 hover:text-rose-700 font-medium">
                Verify
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">
          Additional Verifications
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div>• Government ID verification</div>
          <div>• Background check (available in some regions)</div>
          <div>• Professional references</div>
        </div>
      </div>
    </div>
  );
};

export default VerificationTab;
