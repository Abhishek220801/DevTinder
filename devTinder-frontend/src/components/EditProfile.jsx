import { useState } from "react"
import FeedCard from "./FeedCard.jsx"
import {BASE_URL} from '../utils/constants.js'
import { useDispatch } from "react-redux"
import {addUser} from '../utils/userSlice.js'
import axios from 'axios';

const EditProfile = ({ user }) => {
    const [formData, setFormData] = useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        emailId: user.emailId || "",
        photoUrl: user.photoUrl || "",
        age: user.age || "",
        gender: user.gender || "",
        about: user.about || "",
        skills: user.skills || [],
    })
    
    const dispatch = useDispatch();

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // basic guardrails
    if (!formData.firstName || !formData.emailId) {
      setError("First name and email are required")
      setSuccess('');
      return
    }

    await saveProfile();
  }

  const saveProfile = async () => {
    try{
        setError("")
        setSuccess("")
        const res = await axios.patch(BASE_URL+'/profile/edit', 
            formData, {withCredentials: true}
        )
        dispatch(addUser(res?.data?.data));
        setSuccess("Profile updated successfully")
    } catch (err) {
        console.log(err);
        setError(err?.data || 'Something went wrong. Try again.');
    }
  }

  return (
    <div className="flex space-x-40 justify-center">
      <div className="flex my-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-base-200 p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

          {!success && error && <p className="text-red-500 mb-2">{error}</p>}
          {!error && success && <p className="text-green-500 mb-2">{success}</p>}

          {/* First Name */}
          <label className="label">First Name</label>
          <input
            type="text"
            name="firstName"
            className="input input-bordered w-full mb-3"
            value={formData.firstName}
            onChange={handleChange}
          />

          {/* Last Name */}
          <label className="label">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="input input-bordered w-full mb-3"
            value={formData.lastName}
            onChange={handleChange}
          />

          {/* Email */}
          <label className="label">Email</label>
          <input
            type="email"
            name="emailId"
            className="input input-bordered w-full mb-3"
            value={formData.emailId}
            onChange={handleChange}
          />

          {/* Photo URL */}
          <label className="label">Photo URL</label>
          <input
            type="text"
            name="photoUrl"
            className="input input-bordered w-full mb-3"
            value={formData.photoUrl}
            onChange={handleChange}
          />

          {/* Age */}
          <label className="label">Age</label>
          <input
            type="number"
            name="age"
            className="input input-bordered w-full mb-3"
            value={formData.age}
            onChange={handleChange}
          />

          {/* Gender */}
          <label className="label">Gender</label>
          <input
            type="string"
            name="gender"
            className="input input-bordered w-full mb-3"
            value={formData.gender}
            onChange={handleChange}
          />

          {/* About */}
          <label className="label">About</label>
          <textarea
            name="about"
            className="textarea textarea-bordered w-full mb-3"
            value={formData.about}
            onChange={handleChange}
          />

          {/* Skills */}
          <label className="label">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            className="input input-bordered w-full mb-4"
            value={formData.skills.join(', ')}
            onChange={(e) =>
            setFormData((prev) => ({
            ...prev,
            skills: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }))
            } 
          />

          <button type="submit" className="btn btn-primary w-full">
            Save Changes
          </button>
        </form>
      </div>
      <FeedCard user={formData}/>
    </div>
  )
}

export default EditProfile
