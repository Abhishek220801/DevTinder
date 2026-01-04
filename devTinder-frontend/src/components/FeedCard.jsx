import { useState } from "react"
import {
  Heart,
  X,
  Code2,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { BASE_URL } from "../utils/constants"
import { removeUserFromFeed } from "../utils/FeedSlice"
import { useEffect } from "react"

const FeedCard = ({ user }) => {
  const {
    _id,
    firstName,
    lastName,
    about,
    skills,
    photoUrl,
    age,
    gender,
    location,
    currentRole,
    company,
    github,
    linkedin,
    twitter,
  } = user
  const [isFlipping, setIsFlipping] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
  console.log("FeedCard mounted")
  return () => console.log("FeedCard unmounted")
}, [])

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return "https://geographyandyou.com/images/user-profile.png"

    // If it's already a full URL (http/https), return as-is
    if (photoUrl.startsWith("http")) return photoUrl

    // If it's a relative path starting with /uploads/, prepend BASE_URL
    if (photoUrl.startsWith("/uploads/")) {
      return `${BASE_URL}${photoUrl}`
    }

    // Fallback: return as-is
    return photoUrl
  }

  const handleSendRequest = async (status) => {
    if (isFlipping) return
    setIsFlipping(true)
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      )
      setTimeout(() => dispatch(removeUserFromFeed(_id)), 300)
    } catch (err) {
      console.error(err)
      setIsFlipping(false)
    }
  }

  return (
    <div
      className={`w-full max-w-md transition-all duration-300 ${
        isFlipping ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div className="relative bg-linear-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-purple-500/20">
        {/* Gradient Overlay on Image */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={getPhotoUrl(photoUrl)}
            alt={`${firstName}'s profile`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent" />

          {/* Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-1">
                  {firstName} {lastName || ""} {age}
                </h2>
                {currentRole && (
                  <div className="flex items-center gap-2 text-purple-300 mb-2">
                    <Briefcase size={16} />
                    <span className="text-sm font-medium">
                      {currentRole} {company && `@${company}`}
                    </span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin size={14} />
                    <span className="text-xs">{location}</span>
                  </div>
                )}
              </div>

              {/* Online Status Indicator */}
              <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-300 font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* About */}
          {about && (
            <div>
              <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                {about}
              </p>
            </div>
          )}

          {/* Skills */}
          {Array.isArray(skills) && skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Code2 size={16} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Tech Stack
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 6).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 6 && (
                  <span className="px-3 py-1.5 bg-slate-700/50 rounded-full text-xs font-medium text-slate-400">
                    +{skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="flex gap-3 pt-2">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-700/50"
              >
                <Github size={18} className="text-slate-300" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800/50 hover:bg-blue-600/20 rounded-lg transition-colors border border-slate-700/50"
              >
                <Linkedin size={18} className="text-blue-400" />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800/50 hover:bg-sky-600/20 rounded-lg transition-colors border border-slate-700/50"
              >
                <Twitter size={18} className="text-sky-400" />
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-0">
          <div className="flex gap-4">
            <button
              disabled={isFlipping}
              onClick={() => handleSendRequest("pass", _id)}
              className="flex-1 group relative overflow-hidden bg-linear-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <X size={22} strokeWidth={2.5} />
                <span>Pass</span>
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>

            <button
              disabled={isFlipping}
              onClick={() => handleSendRequest("like", _id)}
              className="flex-1 group relative overflow-hidden bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Heart size={22} strokeWidth={2.5} />
                <span>Connect</span>
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Demo Feed Component
export default FeedCard
