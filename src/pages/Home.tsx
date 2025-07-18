import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const userState = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userState.isLoggedIn) {
      navigate("/"); // redirect to login/signup
    }
  }, [userState.isLoggedIn, navigate]);

  if (!userState.isLoggedIn) {
    return null; // prevent rendering
  }

  return (
    <div className="flex justify-center relative top-[100px] bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome {userState.firstName || userState.displayName || "User"}!
      </h1>
    </div>
  );
};

export default Home;
