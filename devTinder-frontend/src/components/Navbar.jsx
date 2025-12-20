import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          👨🏼‍💻DevTinder
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        {user ? (
          <>
            <div className="form-control">Welcome, {user.firstName}</div>
            <div className="dropdown dropdown-end mx-5 flex">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full overflow-hidden">
                  <img
                    alt={`${user.firstName}'s photo`}
                    src={user.photoUrl}
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName || ''}&background=random`;
                    }}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <Link onClick={handleLogout}>Logout</Link>
                </li>
              </ul>
            </div>
          </>
        ) : (
          // Loading skeleton while user data is being fetched
          <div className="flex gap-2 items-center">
            <div className="skeleton h-4 w-32"></div>
            <div className="skeleton h-10 w-10 rounded-full mx-5"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;