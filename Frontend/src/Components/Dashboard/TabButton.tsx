type TabButtonProps = {
  id: string;
  label: string;
  active: boolean;
  onClick: (id: string) => void;
};

const TabButton = ({ id, label, active, onClick }: TabButtonProps) => (
  <button
    onClick={() => onClick(id)}
    className={`px-6 py-3 font-medium border-b-2 transition-colors ${
      active
        ? "border-rose-500 text-rose-600"
        : "border-transparent text-gray-600 hover:text-gray-900"
    }`}
  >
    {label}
  </button>
);

export default TabButton;
