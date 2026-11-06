import { useEffect, useState } from "react";
import { fetchJson } from "../services/api.js";
export function useAccount(userId) {
  const [data, setData] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetchJson(`/account/${userId}`)
      .then((d) => active && setData(d))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [userId]);
  return { data, error };
}
