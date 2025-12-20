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
          {firstName} {lastName || ""}
        </h2>

        {age || gender && (
          <span className="absolute bottom-3 left-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {age || ''} · {gender || ''}
          </span>
        )}
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
        <div className="card-actions justify-between pt-4">
          <button className="btn btn-outline btn-error w-[48%]">
            Ignore
          </button>
          <button className="btn btn-primary w-[48%]">
            Interested
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedCard
