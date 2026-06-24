import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-6 text-purple-400 text-9xl font-extrabold tracking-tight">
        404
      </div>
      <h2 className="text-2xl font-semibold text-white mb-3">
        Page Not Found
      </h2>
      <p className="text-gray-400 mb-8 max-w-sm text-sm leading-relaxed">
        Looks like this page doesn't exist in your productivity universe. 
        Let's get you back on track.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;