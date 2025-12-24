import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Requests = () => {
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRequests = async () => {
  try {
    setLoading(true);
    const res = await axios.get(
      `${BASE_URL}/user/requests/received`,
      { withCredentials: true }
    );

    if (res?.data?.message === "No new connection requests") {
      setMessage("No new requests found");
      return;
    }

    setRequests(res?.data?.data || []);
  } catch (err) {
    console.error(err);
    setMessage("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    getRequests();
  }, []);

  // 👇 Rendering logic lives here

  if (loading) {
  return (
    <div className="flex justify-center items-center h-60 text-gray-400">
      Loading requests…
    </div>
  );
}

if (message) {
  return (
    <div className="flex justify-center items-center h-60 text-gray-400">
      {message}
    </div>
  );
}


  return (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-2xl font-semibold mb-6 text-white">
      Connection Requests
    </h1>

    {requests.length === 0 ? (
      <div className="text-center text-gray-400">
        No pending requests
      </div>
    ) : (
      <div className="space-y-4">
        {requests.map(({ _id, fromUserId }) => (
          <div
            key={_id}
            className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            {/* Left: user info */}
            <div className="flex items-center gap-4">
              <img
                src={fromUserId.photoUrl}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="font-medium text-white">
                  {fromUserId.firstName} {fromUserId.lastName}
                </h2>
                <p className="text-sm text-gray-400">
                  {fromUserId.about || "No bio available"}
                </p>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 transition text-sm">
                Accept
              </button>
              <button className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  );
};

export default Requests;
