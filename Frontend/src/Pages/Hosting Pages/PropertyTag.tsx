
import React from "react";
import { motion } from "framer-motion";
import { FaGem, FaHeart } from "react-icons/fa";
import { useShallow } from "zustand/react/shallow";
import { MdNaturePeople, MdHistoryEdu } from "react-icons/md";
import { useHostingProcessStore } from "@/Store/HostingProcessStore";
import { BsHouseDoorFill } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";

interface HighlightOption {
  label: string;
  icon: React.JSX.Element;
}

const options: HighlightOption[] = [
  { label: "Rare", icon: <FaGem /> },
  { label: "Rustic", icon: <BsHouseDoorFill /> },
  { label: "In nature", icon: <MdNaturePeople /> },
  { label: "Memorable", icon: <HiOutlinePhotograph /> },
  { label: "Romantic", icon: <FaHeart /> },
  { label: "Historic", icon: <MdHistoryEdu /> },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    y: 60,
    opacity: 0,
    rotate: -5,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function Highlights(): React.JSX.Element {
  const { highlights, setHighlight } = useHostingProcessStore(
    useShallow((state) => ({
      highlights: state.listingInfo.highlight,
      setHighlight: state.setHighlight,
    }))
  );

  const toggleSelection = (label: string) => {
      setHighlight(label);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 relative top-50">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
        className="text-center mb-6"
      >
        <h1 className="text-5xl my-5 ChoosePropertyHead font-bold">
          Next, let's describe your castle
        </h1>
        <p className="text-gray-500">
          Choose up to 2 highlights. We'll use these to get your description
          started.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-4 max-w-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {options.map((option) => {
          const isSelected = highlights.includes(option.label);
          return (
            <motion.button
              key={option.label}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSelection(option.label)}
              className={`flex items-center gap-2 border px-4 py-2 rounded-full text-sm transition-all duration-200
                ${
                  isSelected
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:border-black"
                }
              `}
            >
              {option.icon}
              {option.label}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
