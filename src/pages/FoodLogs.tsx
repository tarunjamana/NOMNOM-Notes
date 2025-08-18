import FoodSearch from "../components/FoodSearch";
import { useState } from "react";
import { APIFoodItem } from "../types/health";
import FoodModal from "../components/FoodModal";
import FoodGrid from "../components/FoodGrid";
const FoodLogs = () => {
  const [selected, setSelected] = useState<APIFoodItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] mt-[20px] bg-gray-100 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Food logs pages</h1>
      <FoodSearch
        selected={selected}
        setSelected={setSelected}
        setIsOpen={setIsOpen}
      />
      {isOpen && selected && (
        <FoodModal setIsOpen={setIsOpen} selected={selected} />
      )}
      <FoodGrid />
    </div>
  );
};

export default FoodLogs;
