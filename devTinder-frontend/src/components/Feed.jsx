import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { BASE_URL } from "../utils/constants"
import { addFeed } from "../utils/FeedSlice"
import { useEffect } from "react"
import FeedCard from "./FeedCard"

const Feed = () => {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch()

  const getFeed = async () => {
    if (feed) return
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      })
      dispatch(addFeed(res.data))
    } catch (err) {
      res.status(404)
    }
  }

  useEffect(() => {
    getFeed()
  }, [])
  return feed && (
    <div className="flex justify-center my-10">
      <FeedCard user={feed[0]}/>
    </div>
  )
}

export default Feed
