import { useEffect, useState } from 'react';
import {BASE_URL} from '../utils/constants'
import axios from 'axios';

const Connections = () => {
  let [connections, setConnections] = useState([]);
    const fetchConnections = async () => {
        const res = await axios.get(BASE_URL+'/user/connections', {withCredentials: true});
        setConnections(...connections, res?.data?.data);
    }

    useEffect(() => {
      fetchConnections();
    }, [])
    
  return (
    <div className='flex justify-center my-10'>
      <h1 className='text-bold text-2xl'>Connections Page</h1>
      <ul>{connections.map(u => <li key={crypto.randomUUID()}>{u.firstName+' '+u.lastName}</li>)}</ul>
    </div>
  )
}

export default Connections
