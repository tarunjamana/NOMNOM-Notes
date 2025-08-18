interface FoodItemRowProps {
  name: string;
  calories: number;
  quantity: number;
  servingUnit: string;
  thumbnailUrl?: string; // Optional thumbnail URL
}

export const FoodItemRow = ({
  name,
  calories,
  quantity,
  servingUnit,
  thumbnailUrl,
}: FoodItemRowProps) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-2 mb-2">
      {/* thumbnail Block */}
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt="name"
          className="w-6 h-6 rounded-lg object-cover"
        />
      )}
      {/* Food Details Block */}
      <div className="flex flex-col flex-1 px-3">
        <span className="font-medium text-gray-800">{name}</span>
        <span className="text-sm text-gray-500">
          {quantity} {servingUnit}
        </span>
      </div>

      {/* Calories Block */}
      <div className="text-right">
        <span className="text-sm font-semibold text-orange-500">
          {Math.round(calories)} kcal
        </span>
      </div>
    </div>
  );
};
