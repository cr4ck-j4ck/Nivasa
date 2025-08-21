// @ts-nocheck

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGem, FaTree, FaHeart } from "react-icons/fa";
import { MdNaturePeople, MdHistoryEdu } from "react-icons/md";
import { BsHouseDoorFill } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";
import React from "react";
type HighlightOption = {
  label: string;
  icon: React.JSX.Element;
};

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
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function CastleHighlights(): JSX.Element {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (label: string) => {
    setSelected((prev) => {
      if (prev.includes(label)) {
        return prev.filter((item) => item !== label);
      } else if (prev.length < 2) {
        return [...prev, label];
      }
      return prev; // max 2
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 relative top-50">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold">Next, let's describe your castle</h1>
        <p className="text-gray-500">
          Choose up to 2 highlights. We'll use these to get your description started.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {options.map((option, index) => {
          const isSelected = selected.includes(option.label);
          return (
            <motion.button
              key={option.label}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSelection(option.label)}
              className={`flex items-center gap-2 border px-4 py-2 rounded-full text-sm transition-all duration-200
                ${isSelected ? "bg-black text-white border-black" : "bg-white text-black border-gray-300 hover:border-black"}
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
