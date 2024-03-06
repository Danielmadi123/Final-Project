import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useSessionTimeout = (timeoutPeriod = 4 * 60 * 60 * 24 * 1000) => {
  const [isActive, setIsActive] = useState(true);
  const nav = useNavigate();
  useEffect(() => {
    let timeoutId;
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      setIsActive(true);
      timeoutId = setTimeout(() => {
        setIsActive(false);
        localStorage.removeItem("token");
        nav("/login");
        alert("Inactive for too long, please relog");
      }, timeoutPeriod);
    };

    window.addEventListener("load", resetTimeout);
    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("mousedown", resetTimeout);
    window.addEventListener("touchstart", resetTimeout);
    window.addEventListener("click", resetTimeout);
    window.addEventListener("keypress", resetTimeout);
    window.addEventListener("scroll", resetTimeout, true);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("load", resetTimeout);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("mousedown", resetTimeout);
      window.removeEventListener("touchstart", resetTimeout);
      window.removeEventListener("click", resetTimeout);
      window.removeEventListener("keypress", resetTimeout);
      window.removeEventListener("scroll", resetTimeout);
    };
  }, []);

  return isActive;
};
