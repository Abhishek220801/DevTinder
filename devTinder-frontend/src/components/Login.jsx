import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useNavigate } from "react-router"
import { BASE_URL } from "../utils/constants"

const Login = () => {
  const [emailId, setEmailId] = useState("abhishek@gmail.com")
  const [password, setPassword] = useState("Abhi@123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((store) => store.user);

  useEffect(() => { 
    if(user) navigate('/');
  }, [user, navigate]);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
      try {
        const res = await axios.post(
          BASE_URL + "/login",
          {
            emailId,
            password,
          },
          { withCredentials: true }
        )
        console.log('user data ', res.data)
        dispatch(addUser(res.data))
        navigate('/feed');
      } catch (err) {
        setError(err.response?.data?.message || "Wrong credentials, Please try again.")
        console.error(err);
      } finally{
        setIsLoading(false);
      }
    }

    const handleKeyPress = (e) => {
      if(e.key === 'Enter') handleLogin();
    }

  return (
    <div className="flex justify-center my-10">
      <fieldset className="fieldset bg-base-300 border-base-300 rounded-box w-xs border p-4 ">
        <legend className="fieldset-legend">Login</legend>

        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value) + setError('')}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={
            (e) => setPassword(e.target.value) + setError('')
          }
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        {error && (
          <div className="text-error mt-2 mb-1">
            <span>{error}</span>
          </div>
        )}

        <button className="btn btn-neutral mt-4 w-full" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </fieldset>
    </div>
  )
}

export default Login
