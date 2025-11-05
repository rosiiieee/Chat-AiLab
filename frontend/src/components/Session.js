import { useState, useEffect } from 'react'

export default function Session () {
  const [uuid, setUuid] = useState(() => {
    return localStorage.getItem("uuid") || crypto.randomUUID();
  });

  useEffect(() => {
    localStorage.setItem("uuid", uuid);
  }, [uuid]);

  console.log("Session ID:", uuid);
  return null;
}