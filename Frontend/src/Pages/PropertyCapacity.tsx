import { motion } from "framer-motion";
import { useState } from "react";

const Counter = ({
  title,
  value,
  min = 0,
  onChange,
}: {
  title: string;
  value: number;
  min?: number;
  onChange: (newVal: number) => void;
}) => {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => onChange(value + 1);

  const isDecrementDisabled = value <= min;

  return (
    <motion.div
      className="flex items-center justify-between border-b py-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-2xl font-medium text-gray-800">{title}</div>
      <div className="flex items-center gap-4">
        <button
          onClick={decrement}
          disabled={isDecrementDisabled}
          className={`w-10 h-10 rounded-full border text-2xl font-bold flex items-center justify-center transition-all ${
            isDecrementDisabled
              ? "cursor-not-allowed text-gray-300 border-gray-300"
              : "hover:bg-gray-100"
          }`}
        >
          –
        </button>
        <motion.span
          key={value}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="w-6 text-center font-medium text-lg"
        >
          {value}
        </motion.span>
        <button
          onClick={increment}
          className="w-10 h-10 rounded-full border text-2xl font-bold flex items-center justify-center hover:bg-gray-100 transition-all"
        >
          +
        </button>
      </div>
    </motion.div>
  );
};

const PropertyCapacity = () => {
  const [guests, setGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-6 py-12">
      <motion.div
        className="w-full max-w-3xl rounded-xl p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl showHead font-semibold text-gray-900 mb-2">
          Share some basics about your place
        </h1>
        <p className="text-gray-500 mb-8 text-xl">
          You'll add more details later, such as bed types.
        </p>

        <Counter title="Guests" value={guests} min={1} onChange={setGuests} />
        <Counter title="Bedrooms" value={bedrooms} min={1} onChange={setBedrooms} />
        <Counter title="Beds" value={beds} min={1} onChange={setBeds} />
        <Counter title="Bathrooms" value={bathrooms} min={1} onChange={setBathrooms} />
      </motion.div>
    </div>
  );
};

export default PropertyCapacity;

