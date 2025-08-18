import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  DocumentData,
  DocumentSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAppSelector } from "../store/hooks";
import { format } from "date-fns";
import { FoodItem } from "../types/health";
import { FoodItemRow } from "./FoodItemRow";

type Props = {
  displayName: string;
};

// Firestore doc shape (meals for a day)
type MealDoc = Record<string, FoodItem[]>;

const DisplayFoodLogGrid = ({ displayName }: Props) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const { uid } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!uid) return;

    const today = format(new Date(), "yyyy-MM-dd");
    const mealRef = doc(db, "users", uid, "meals", today);

    // ✅ Listen in real-time with correct typings
    const unsubscribe: Unsubscribe = onSnapshot(
      mealRef,
      (mealSnap: DocumentSnapshot<DocumentData>) => {
        if (mealSnap.exists()) {
          const data = mealSnap.data() as MealDoc;
          setFoods(data[displayName.toLowerCase()] ?? []);
        } else {
          setFoods([]);
        }
      }
    );

    return () => unsubscribe();
  }, [uid, displayName]);

  return (
    <div className="flex min-w-[400px] max-w-[450px] min-h-[250px] bg-white h-full flex-col border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-800">{displayName}</h3>
      {foods.length > 0 ? (
        foods.map((item) => (
          <FoodItemRow
            key={item.id}
            name={item.name}
            calories={item.calories}
            quantity={item.servingQty}
            servingUnit={item.servingUnit}
            thumbnailUrl={item.thumbnailUrl}
          />
        ))
      ) : (
        <p className="text-sm text-gray-400">No items yet</p>
      )}
    </div>
  );
};

export default DisplayFoodLogGrid;
