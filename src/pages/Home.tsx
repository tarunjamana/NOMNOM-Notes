import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import WaterIntakeWidget from "../components/WaterIntakeWidget";
import WeightTrackerWidget from "../components/WeightTrackerWidget";

const Home = () => {
  const userState = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userState.isLoggedIn) {
      void navigate("/"); // redirect to login/signup
    }
  }, [userState.isLoggedIn, navigate]);

  if (!userState.isLoggedIn) {
    return null; // prevent rendering
  }

  return (
    <div className="relative top-[100px] bg-gray-100">
      <h1 className="text-4xl text-center font-bold text-blue-600">
        Welcome {userState.firstName || userState.displayName || "User"}!
      </h1>
      {/* Widget Grid */}
      <div className="max-w-3xl grid p-6 m-4 grid-cols-1 md:grid-cols-2 gap-2">
        <WaterIntakeWidget />
        <WeightTrackerWidget />
      </div>
    </div>
  );
};

export default Home;
