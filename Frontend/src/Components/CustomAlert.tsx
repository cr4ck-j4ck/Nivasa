import { X, XCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

type AlertVariant = "error" | "success" | "info" | "warning";

interface AlertProps {
  title?: string;
  message: string;
  setFunc?:()=>void;
  variant?: AlertVariant;
  duration?: number; // in ms
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; text: string; ring: string; Icon: React.ElementType }> = {
  error: {
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-800",
    ring: "ring-red-200",
    Icon: XCircle,
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
    ring: "ring-green-200",
    Icon: CheckCircle,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-800",
    ring: "ring-blue-200",
    Icon: Info,
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-800",
    ring: "ring-yellow-200",
    Icon: AlertTriangle,
  },
};

const CustomAlert: React.FC<AlertProps> = ({
  title,
  message,
  setFunc,
  variant = "error",
  duration = 7000,
}) => {
  const [visible, setVisible] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  const { bg, border, text, ring, Icon } = variantStyles[variant];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateOut(true);
      setFunc?.();
      setTimeout(() => setVisible(false), 300); // wait for animation
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, setFunc]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] sm:w-auto
        transition-all duration-300 ease-out
        ${
          animateOut
            ? "opacity-0 -translate-y-4 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
    >
      <div className={`relative flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl animate-bounce-in border ${bg} ${border} ${text} ring-1 ${ring}`}>
        <Icon className={`w-6 h-6 mt-0.5`} />
        <div className="flex-1">
          {title && <h2 className="font-semibold text-base mb-1">{title}</h2>}
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={() => {
            setAnimateOut(true);
            setTimeout(() => setVisible(false), 300);
          }}
          className={`absolute top-2 right-2 ${text} hover:opacity-80 transition`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default CustomAlert;