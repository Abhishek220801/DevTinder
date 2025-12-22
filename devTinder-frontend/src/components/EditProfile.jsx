import { useEffect, useState } from "react";
import FeedCard from "./FeedCard.jsx";
import { BASE_URL } from "../utils/constants.js";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice.js";
import axios from "axios";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    photoUrl: "",
    age: "",
    gender: "",
    about: "",
    skills: [],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailId: user.emailId || "",
      photoUrl: user.photoUrl || "",
      age: user.age || "",
      gender: user.gender || "",
      about: user.about || "",
      skills: user.skills || [],
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.emailId) {
      setError("First name and email are required");
      return;
    }
    saveProfile();
  };

  const saveProfile = async () => {
    try {
      setError("");
      setSuccess("");
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        formData,
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* EDIT FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-base-200 rounded-xl shadow-lg p-6 
                     max-h-[75vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-semibold mb-6 tracking-tight">
            Edit Profile
          </h2>

          {error && <p className="text-red-500 mb-3">{error}</p>}
          {success && <p className="text-green-500 mb-3">{success}</p>}

          {[
            ["First Name", "firstName", "text"],
            ["Last Name", "lastName", "text"],
            ["Email", "emailId", "email"],
            ["Photo URL", "photoUrl", "text"],
            ["Age", "age", "number"],
            ["Gender", "gender", "text"],
          ].map(([label, name, type]) => (
            <div key={name} className="mb-4">
              <label className="text-sm text-gray-400 block mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="input input-bordered w-full h-11"
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="text-sm text-gray-400 block mb-1">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="textarea textarea-bordered w-full min-h-[100px]"
            />
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-400 block mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              value={formData.skills.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  skills: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              className="input input-bordered w-full h-11"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Save Changes
          </button>
        </form>

        {/* PREVIEW (READ-ONLY) */}
        <div className="sticky top-24">
          <FeedCard user={formData} variant="preview" />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
