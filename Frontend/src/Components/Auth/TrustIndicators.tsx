import { Shield , Award, Globe } from "lucide-react";

// Trust Indicators Component
const TrustIndicators: React.FC = () => (
  <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
    <div className="flex items-center gap-1">
      <Shield className="w-4 h-4" />
      Secure
    </div>
    <div className="flex items-center gap-1">
      <Award className="w-4 h-4" />
      Trusted
    </div>
    <div className="flex items-center gap-1">
      <Globe className="w-4 h-4" />
      Global
    </div>
  </div>
);

export default TrustIndicators