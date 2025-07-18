import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { Link } from "react-router-dom";
import { clearUser } from "../store/slices/userSlice";
import { clearUserProfile } from "../store/slices/userProfileSlice";

const Header = () => {
  const userState = useAppSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const dispatch = useAppDispatch();
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !(menuRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    // Handle logout logic here
    dispatch(clearUser());
    dispatch(clearUserProfile());
    setShowMenu(false);
  };
  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-gray-100 text-black shadow-md z-50 flex items-center justify-between px-6">
      <Link to="/home">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="NOMNOM Notes logo" className="h-12 w-12" />
          <span className="text-xl font-bold text-gray-800">NOMNOM Notes</span>
        </div>
      </Link>

      <div className="relative" ref={menuRef}>
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-lg shadow-md cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {userState.isLoggedIn ? (
            userState.displayName?.charAt(0).toUpperCase()
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A9.003 9.003 0 0112 15a9.003 9.003 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </div>

        {/* Popup Menu */}
        {userState.isLoggedIn && showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
            <ul className="py-2">
              <li>
                <Link
                  to="/profile"
                  onClick={() => setShowMenu(false)}
                  className="block w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </Link>
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleClick()}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
