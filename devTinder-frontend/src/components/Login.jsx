import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { addUser, removeUser } from "../utils/userSlice"
import { useNavigate } from "react-router"
import { BASE_URL } from "../utils/constants"

const Login = () => {
  const [emailId, setEmailId] = useState("abhishek@gmail.com")
  const [password, setPassword] = useState("Abhi@123")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
      try {
        const res = await axios.post(
          BASE_URL + "/login",
          {
            emailId,
            password,
          },
          { withCredentials: true }
        )
        dispatch(addUser(res.data))
        return navigate('/');
      } catch (err) {
        console.log(err);
      }
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
          onChange={(e) => setEmailId(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-neutral mt-4" onClick={handleLogin}>
          Login
        </button>
      </fieldset>
    </div>
  )
}

export default Login
