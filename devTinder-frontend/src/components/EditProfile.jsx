import { useEffect, useState } from "react"
import FeedCard from "./FeedCard.jsx"
import { BASE_URL } from "../utils/constants.js"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice.js"
import axios from "axios"

const EditProfile = ({ user }) => {
  const dispatch = useDispatch()
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    photoUrl: "",
    photo: null,
    age: "",
    gender: "",
    about: "",
    skills: [],
    location: "",
    currentRole: "",
    company: "",
    github: "",
    linkedin: "",
    twitter: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!user) return

    setFormData((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailId: user.emailId || "",
      photoUrl: user.photoUrl || prev.photoUrl,
      age: user.age || "",
      gender: user.gender || "",
      about: user.about || "",
      skills: user.skills || [],
      location: user.location || "",
      currentRole: user.currentRole || "",
      company: user.company || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      twitter: user.twitter || "",
    }))
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
    setSuccess("")
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    setFormData((prev) => ({
      ...prev,
      photo: file,
    }))

    // Create preview URL
    if (previewPhotoUrl) {
      URL.revokeObjectURL(previewPhotoUrl)
    }
    const previewUrl = URL.createObjectURL(file)
    setPreviewPhotoUrl(previewUrl)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.emailId) {
      setError("First name and email are required")
      return
    }
    saveProfile()
  }

  const saveProfile = async () => {
    try {
      setError("")
      setSuccess("")

      const data = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photo") return
        if (value == null || value === "") return
        if (Array.isArray(value) && value.length === 0) return

        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value))
        } else {
          data.append(key, value)
        }
      })
      if (formData.photo) {
        data.append("photo", formData.photo)
      }

      const res = await axios.patch(BASE_URL + "/profile/edit", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      dispatch(addUser(res?.data?.data))
      if (previewPhotoUrl) {
        URL.revokeObjectURL(previewPhotoUrl)
      }
      setPreviewPhotoUrl("")
      setFormData((prev) => ({
        ...prev,
        photo: null,
        photoUrl: res.data.data.photoUrl,
        skills: res.data.data.skills || [],
      }))
      setSuccess("Profile updated successfully")
    } catch (err) {
      setError(
        err?.response?.data?.message || "Something went wrong. Try again."
      )
    }
  }

  useEffect(() => {
    return () => {
      if (previewPhotoUrl) {
        URL.revokeObjectURL(previewPhotoUrl)
      }
    }
  }, [previewPhotoUrl])
  
  useEffect(() => {
    return () => {
      if (previewPhotoUrl) {
        URL.revokeObjectURL(previewPhotoUrl)
      }
    }
  }, [previewPhotoUrl])
  
  if (!user) return null

  const displayPhotoUrl = previewPhotoUrl || formData.photoUrl

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
            ["Age", "age", "number"],
            ["Location", "location", "text"],
            ["Current Role", "currentRole", "text"],
            ["Company", "company", "text"],
            ["GitHub", "github", "text"],
            ["LinkedIn", "linkedin", "text"],
            ["Twitter", "twitter", "text"],
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
            Profile Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          {displayPhotoUrl && (
            <div className="mt-2">
                <img 
                  src={displayPhotoUrl.startsWith('blob:') ? displayPhotoUrl : `http://localhost:7777${displayPhotoUrl}`}
                  alt="Preview" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                />
              </div>
          )}
      </div>
          {/* <input
            type="text"
            name="photoUrl"
            placeholder="Or paste image URL"
            value={formData.photoUrl}
            onChange={handleChange}
            className="input input-bordered w-full h-11"
          /> */}
          <div className="mb-4">
          <label className="text-sm text-gray-400 block mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-400 block mb-1">About</label>
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
              onChange={(e) => {
                const skillsArray = e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                setFormData((prev) => ({
                  ...prev,
                  skills: skillsArray
                }))
              }}
              className="input input-bordered w-full h-11"
              placeholder="React, Node.js, Python..."
            />
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Save Changes
          </button>
        </form>

        {/* PREVIEW (READ-ONLY) */}
        <div className="sticky top-24">
          <div className="mb-2 text-center text-sm text-gray-4000">
            Live Preview
          </div>
          <FeedCard
            user={{
              ...formData,
              photoUrl: displayPhotoUrl,
            }}
            variant="preview"
          />
        </div>
      </div>
    </div>
  )
}

export default EditProfile
