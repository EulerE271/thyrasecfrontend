import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [response, setResponse] = useState('');

  useEffect(() => {
    axios.get('/test', {
      withCredentials: true,
    }) // Use your axios instance
      .then((response) => {
        setResponse(response.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <p>Hello from protected route</p>
      <p>Authenticated: {response}</p>
    </div>
  );
}

export default Dashboard;
