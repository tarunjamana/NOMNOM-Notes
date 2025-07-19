import { motion } from "framer-motion";

import { Interest } from "../types/user";

const InterestCard = ({
  interest,
  selected,
  onToggle,
  maxReached,
}: {
  interest: Interest;
  selected: boolean;
  onToggle: (id: string) => void;
  maxReached: boolean;
}) => {
  return (
    <motion.div
      whileHover={{ scale: selected ? 1 : 1.03 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        selected
          ? "bg-blue-100 border-blue-400 shadow-sm"
          : maxReached
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-50 border-gray-200"
      }`}
      onClick={() => (!maxReached || selected ? onToggle(interest.id) : null)}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{interest.name}</span>
      </div>
    </motion.div>
  );
};

export default InterestCard;
