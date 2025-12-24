import { useEffect, useState } from 'react';
import {BASE_URL} from '../utils/constants'
import axios from 'axios';

const Connections = () => {
  let [connections, setConnections] = useState([]);
  const [loading, setIsLoading] = useState(false);
    const fetchConnections = async () => {
      try{
        setIsLoading(true);
        const res = await axios.get(BASE_URL+'/user/connections', 
          {withCredentials: true}
        );
        setConnections(res?.data?.data || []);
      } catch(err){
        console.error(err)
      } finally{
        setIsLoading(false);
      }
    }

    useEffect(() => {
      fetchConnections();
    }, [])
    
  return (
     <div className="text-center my-10">
    <h1 className="font-bold text-2xl mb-6">Connections</h1>

    {loading && (
      <div className="text-gray-400">Loading connections…</div>
    )}

    {!loading && connections.length === 0 && (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
        <p className="text-lg">No connections yet</p>
        <p className="text-sm mt-1">
          When you connect with people, they’ll show up here.
        </p>
      </div>
    )}

    {!loading &&
      connections.map(
        ({ _id, firstName, lastName, about, photoUrl, age }) => (
          <div
            key={_id}
            className="p-6 flex space-x-6 items-center bg-base-300 m-4 rounded-xl max-w-3xl mx-auto"
          >
            <img
              src={photoUrl}
              alt="user"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="text-left">
              <h3 className="font-bold">
                {firstName} {lastName} {age && `, ${age}`}
              </h3>
              <p className="text-sm text-gray-500">
                {about || "No bio available"}
              </p>
            </div>
          </div>
        )
      )}
  </div>
  )
}

export default Connections
