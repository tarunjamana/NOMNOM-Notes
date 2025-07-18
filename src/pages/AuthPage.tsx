import { useState } from "react";
import Login from "./Login";
import Signup from "./SignUp";

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] bg-gray-100 flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        {showLogin ? <Login /> : <Signup />}
        <p className="text-center text-sm text-gray-600 mt-6">
          {showLogin ? (
            <>
              Not a member?{" "}
              <button
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => setShowLogin(false)}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
