import { useState } from "react";
import InterestCard from "./InterestCard";
import { Interest } from "../types/user";
import { FiEdit2 } from "react-icons/fi";

const INTERESTS: Interest[] = [
  { id: "weight_loss", name: "Weight Loss" },
  { id: "muscle_gain", name: "Muscle Gain" },
  { id: "fat_loss", name: "Fat Loss" },
  { id: "strength_training", name: "Strength Training" },
  { id: "endurance", name: "Endurance Improvement" },
  { id: "flexibility", name: "Flexibility & Mobility" },
  { id: "healthy_eating", name: "Healthy Eating Habits" },
  { id: "body_recomposition", name: "Body Recomposition" },
  { id: "injury_recovery", name: "Injury Recovery" },
  { id: "mental_wellbeing", name: "Mental Wellbeing" },
];

const InterestsSection = ({
  initialInterests = [],
  onSave,
}: {
  initialInterests: string[];
  onSave: (interests: string[]) => Promise<void>;
}) => {
  const [selected, setSelected] = useState<string[]>(initialInterests);
  const [isEditing, setIsEditing] = useState(false);
  const MAX_SELECTIONS = 5;

  // Track if selection has changed from initial
  const hasChanges = !(
    selected.length === initialInterests.length &&
    selected.every((interest) => initialInterests.includes(interest))
  );

  const toggleInterest = (id: string) => {
    setSelected((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < MAX_SELECTIONS
        ? [...prev, id]
        : prev;

      // Automatically show save/cancel when changes are made
      if (!isEditing && !hasChanges && newSelection !== prev) {
        setIsEditing(true);
      }

      return newSelection;
    });
  };

  const handleCancel = () => {
    setSelected(initialInterests);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await onSave(selected);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save interests:", error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Fitness Goals and Interests</h3>

        {!isEditing && !hasChanges ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 rounded-full border border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded-full border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={!hasChanges}
              className={`px-3 py-1.5 text-sm text-white rounded-full transition-colors ${
                hasChanges
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {INTERESTS.map((interest) => (
          <InterestCard
            key={interest.id}
            interest={interest}
            selected={selected.includes(interest.id)}
            onToggle={toggleInterest}
            maxReached={
              selected.length >= MAX_SELECTIONS &&
              !selected.includes(interest.id)
            }
          />
        ))}
      </div>
    </>
  );
};

export default InterestsSection;
