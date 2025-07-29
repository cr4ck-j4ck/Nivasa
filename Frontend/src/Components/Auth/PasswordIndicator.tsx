import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface ValidationRule {
  text: string;
  valid: boolean;
}

// Password Strength Indicator Component
const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({ password }) => {
  const [strength, setStrength] = useState<number>(0);

  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    setStrength(score);
  }, [password]);

  if (!password) return null;

  const rules: ValidationRule[] = [
    { text: '8+ chars', valid: password.length >= 8 },
    { text: 'Uppercase', valid: /[A-Z]/.test(password) },
    { text: 'Number', valid: /[0-9]/.test(password) },
    { text: 'Special', valid: /[^A-Za-z0-9]/.test(password) }
  ];

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs text-gray-500">Password strength:</span>
        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              strength < 50 ? 'bg-red-400' : 
              strength < 75 ? 'bg-yellow-400' : 'bg-green-400'
            }`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>
      <div className="flex gap-1 text-xs">
        {rules.map((rule, index) => (
          <span 
            key={index}
            className={`flex items-center gap-1 ${rule.valid ? 'text-green-600' : 'text-gray-400'}`}
          >
            <Check className="w-3 h-3" />
            {rule.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;