import { useAppSelector } from "../store/hooks";
import {
  useGetWaterLogQuery,
  useAddWaterIntakeMutation,
} from "../store/services/waterApi";
const WaterIntakeWidget = () => {
  // const [waterAmount, setWaterAmount] = useState<number>(1200);
  // const targetAmount = 3000;
  // const progress = (waterAmount / targetAmount) * 100;

  const { uid } = useAppSelector((state) => state.user);
  const { data: waterLog, isLoading } = useGetWaterLogQuery(uid, {
    skip: !uid,
  });
  const [addWater] = useAddWaterIntakeMutation();

  const goal = waterLog?.goal ?? 3000;
  const amount = waterLog?.totalIntake ?? 0;
  const progress = (amount / goal) * 100;

  const increaseProgress = (): void => {
    if (uid) {
      void addWater({ uid, amount: 250 });
    }
  };

  // // Create a typed array for the progress dots
  // const progressDots: number[] = Array.from(
  //   { length: 4 },
  //   (_, i) => (i + 1) * 25
  // );

  return (
    <div className="flex max-w-[300px] min-h-[250px] justify-between h-full bg-white flex-col border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Water Intake</h3>
        <span className="text-sm font-medium text-blue-600">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Modern Animated Progress Bar */}
      <div className="relative h-3 mb-6 rounded-full bg-gray-100 overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-60"></div>

        {/* Progress indicator */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer animation */}
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
        </div>

        {/* Progress dots - now type-safe
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {progressDots.map((dotValue) => (
            <div
              key={dotValue}
              className={`h-1.5 w-1.5 rounded-full ${
                progress >= dotValue ? "bg-white" : "bg-blue-200 opacity-40"
              }`}
            ></div>
          ))}
        </div> */}
      </div>

      {/* Amount and button section */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-900">{amount} ml</h3>
          <h3 className="text-sm font-medium text-gray-500">of {goal} ml</h3>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 px-3 py-2 text-white text-sm font-medium rounded-lg cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
          onClick={increaseProgress}
          disabled={isLoading}
        >
          + Add Water
        </button>
      </div>
    </div>
  );
};

export default WaterIntakeWidget;
