import { type LucideIcon, Chrome,Facebook,Apple } from "lucide-react";

interface SocialProvider {
  name: string;
  icon: LucideIcon;
  color: string;
}

// Social Login Component
const SocialLogin: React.FC = () => {
  const providers: SocialProvider[] = [
    { name: 'Google', icon: Chrome, color: 'border-red-300 hover:bg-red-50' },
    { name: 'Facebook', icon: Facebook, color: 'border-blue-300 hover:bg-blue-50' },
    { name: 'Apple', icon: Apple, color: 'border-gray-300 hover:bg-gray-50' }
  ];

  const handleSocialLogin = (provider: string): void => {
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <button
          key={provider.name}
          type="button"
          onClick={() => handleSocialLogin(provider.name)}
          className={`w-full flex items-center justify-center gap-3 py-3 border-2 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] ${provider.color}`}
        >
          <provider.icon className="w-5 h-5" />
          Continue with {provider.name}
        </button>
      ))}
    </div>
  );
};

export default SocialLogin;