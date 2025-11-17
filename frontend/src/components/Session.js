import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from "uuid";

export default function Session () {
  const [uuid, setUuid] = useState(() => {
    return localStorage.getItem("uuid") || uuidv4();
  });

  useEffect(() => {
    localStorage.setItem("uuid", uuid);
  }, [uuid]);

  return null;
}