import FoodSearch from "../components/FoodSearch";
const FoodLogs = () => {
  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] mt-[20px] bg-gray-100 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Food logs pages</h1>
      <FoodSearch />
    </div>
  );
};

export default FoodLogs;
