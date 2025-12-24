import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-[120px] font-extrabold tracking-tight text-neutral-700">
          404
        </h1>

        <p className="text-xl md:text-2xl font-semibold mt-2">
          This page doesn’t exist.
        </p>

        <p className="text-neutral-400 mt-4">
          Either the link is broken, or you typed something that was never meant
          to be found.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition"
        >
          Go back home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
