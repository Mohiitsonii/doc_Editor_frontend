import React from "react";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom"; 

const Greeting = () => {
  const { auth, setAuth } = useAuth(); 
  const navigate = useNavigate(); 

  const handleNavigation = (path) => {
    if (path === "/") {
      localStorage.removeItem("auth");
      setAuth(null); 
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 p-8 text-white flex flex-col">
        <h2 className="text-3xl font-semibold mb-12">Dashboard</h2>
        <ul className="space-y-6">
          <li>
            <button
              onClick={() => handleNavigation("/documents")}
              className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none"
            >
              View Documents
            </button>
          </li>
        </ul>
        <div className="mt-auto text-center text-sm">
          <p>Logged in as {auth?.user?.username}</p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 p-10">
      <div className="bg-white rounded-lg shadow-xl p-8">
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-3xl font-semibold text-gray-900">
      Welcome to Your Dashboard
    </h2>
    <button
      onClick={() => handleNavigation("/")}
      className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none transition duration-300"
    >
      Logout
    </button>
  </div>

  <p className="text-lg text-gray-700 mb-6">
    Manage and view your documents easily. Click below to navigate to your documents.
  </p>

  {/* Single Action Button */}
  <div className="flex justify-center mt-6">
    <button
      onClick={() => handleNavigation("/documents")}
      className="bg-blue-600 text-white py-3 px-12 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition duration-300 transform hover:scale-105"
    >
      View My Documents
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default Greeting;
