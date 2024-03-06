import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  const { search } = useLocation();
  return useMemo(() => {
    let query = {};
    for (let [key, value] of new URLSearchParams(search)) {
      query[key] = value;
    }
    return query;
  }, [search]);
};
export default useQueryParams;
