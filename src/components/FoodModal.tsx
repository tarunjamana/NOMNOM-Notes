import { useState } from "react";
import { APIFoodItem, MealType, FoodItem } from "../types/health";
import { FiX } from "react-icons/fi";
import {
  useGetNaturalSearchItemMutation,
  useLazyGetBrandedFoodQuery,
} from "../store/services/nutritionApi";
import { useAppSelector } from "../store/hooks";
import { format } from "date-fns";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../utils/firebase";
type Props = {
  selected: APIFoodItem | null;
  setIsOpen: (isOpen: boolean) => void;
};

const FoodModal = ({ selected, setIsOpen }: Props) => {
  const { uid } = useAppSelector((state) => state.user);
  const [quantity, setQuantity] = useState(selected?.serving_qty);
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [getNaturalSearchItem] = useGetNaturalSearchItemMutation();
  const [getBrandedSearchItem] = useLazyGetBrandedFoodQuery();

  const isBranded = !!selected?.nix_item_id;
  const servingQty = selected?.serving_qty || 1;

  const handleSubmit = async () => {
    if (!selected || !uid) return;
    try {
      let foodData: FoodItem | null = null;
      const qty = quantity || 1;
      // branded foods
      if (selected.nix_item_id) {
        const res = await getBrandedSearchItem(selected.nix_item_id).unwrap();
        // console.log("Branded Search Item Food Data:", res);
        const brandedFood = res.foods[0];

        foodData = {
          id: brandedFood.nix_item_id,
          name: brandedFood.food_name,
          servingQty: qty * servingQty,
          servingUnit: selected.serving_unit || "",
          calories: brandedFood.nf_calories * qty,
          protein: brandedFood.nf_protein * qty,
          carbs: brandedFood.nf_total_carbohydrate * qty,
          fat: brandedFood.nf_total_fat * qty,
          timeLogged: new Date().toISOString(),
          thumbnailUrl: brandedFood.photo?.thumb || "",
        };
      } else {
        // common food
        const query = `${quantity} ${selected.serving_unit || " "} ${
          selected.food_name
        }`;
        const res = await getNaturalSearchItem({ query }).unwrap();
        // console.log("Common Natural Search food data:", res);
        const nauturalFood = res.foods[0];

        foodData = {
          id: nauturalFood.food_name,
          name: nauturalFood.food_name,
          servingQty: servingQty,
          servingUnit: selected.serving_unit || "",
          calories: nauturalFood.nf_calories,
          protein: nauturalFood.nf_protein,
          carbs: nauturalFood.nf_total_carbohydrate,
          fat: nauturalFood.nf_total_fat,
          timeLogged: new Date().toISOString(),
          thumbnailUrl: nauturalFood.photo?.thumb || "",
        };
      }

      if (foodData) {
        const today = format(new Date(), "yyyy-MM-dd");
        const mealRef = doc(db, "users", uid, "meals", today);

        await setDoc(
          mealRef,
          { [mealType]: arrayUnion(foodData) },
          { merge: true }
        );
      }
      setIsOpen(false);
    } catch (err) {
      console.error("Error saving food to Firestore:", err);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
          {selected?.food_name}
        </h2>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const value = i + 1;
              return (
                <option key={value} value={value}>
                  {isBranded
                    ? `${value} × ${servingQty}${selected.serving_unit || ""}`
                    : `${value}`}
                </option>
              );
            })}
          </select>
        </div>

        {/* Meal Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type
          </label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="snacks">Snacks</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        {/* Unit */}
        <p className="text-sm text-gray-600 mb-6">
          Unit: <span className="italic">{selected?.serving_unit}</span>
        </p>

        {/* Submit */}
        <button
          onClick={() => void handleSubmit()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-lg transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FoodModal;
