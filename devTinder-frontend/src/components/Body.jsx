import { Outlet, useNavigate } from "react-router"
import Navbar from "./Navbar"
import Footer from "./Footer"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useEffect } from "react"

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const fetchUser = async () => {  
    if(user) return;
    try {
      const res = await axios.get(BASE_URL+"/profile", {
        withCredentials: true
      })
      dispatch(addUser(res.data));
    } catch (err) {
      if(err.status === 401) navigate('/login');
      console.error(err)
    }
  }

  useEffect(() => {
    fetchUser();
  }, [])
  
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Body
