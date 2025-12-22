const FeedCard = ({ user }) => {
  const { firstName, lastName, about, skills, photoUrl, age, gender } = user

  return (
    <div className="card bg-base-200 w-96 shadow-2xl rounded-2xl overflow-hidden">
      {/* Image */}
      <figure className="relative h-72 bg-base-300">
        <img
          src={photoUrl || "https://via.placeholder.com/300"}
          alt={`${firstName}'s profile`}
          className="w-full h-full object-cover"
        />
      </figure>

      {/* Body */}
      <div className="card-body p-5 space-y-3">
        <h2 className="card-title text-xl font-semibold">
          {firstName} {lastName || ""} {age}
        </h2>
        
        {about && (
          <p className="text-sm text-gray-400 line-clamp-3">
            {about}
          </p>
        )}

        {Array.isArray(skills) && skills.length > 0 && (
  <div className="flex flex-wrap gap-2">
    {skills.slice(0, 5).map((skill, idx) => (
      <span
        key={idx}
        className="badge badge-outline badge-sm"
      >
        {skill}
      </span>
    ))}
  </div>
)}

        {/* Actions */}
      </div>
    </div>
  )
}

export default FeedCard
