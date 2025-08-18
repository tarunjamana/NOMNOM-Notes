import DisplayFoodLogGrid from "./DisplayedFoodLogGrid";

const FoodGrid = () => {
  const displayNames = ["BreakFast", "Lunch", "Snacks", "Dinner"];
  return (
    <div className="max-w-5xl grid p-6 m-4 grid-cols-1 md:grid-cols-2 gap-16">
      {displayNames.map((displayName) => (
        <DisplayFoodLogGrid key={displayName} displayName={displayName} />
      ))}
    </div>
  );
};

export default FoodGrid;
