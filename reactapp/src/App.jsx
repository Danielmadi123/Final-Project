  import "react-toastify/dist/ReactToastify.css";
  import LayoutComponent from "./layout/LayoutComponent";
  import Router from "./routes/Router";
  import useAutoLogin from "./hooks/useAutoLogin";
  import { useEffect, useState } from "react";
  import { LinearProgress } from "@mui/material";

  const App = () => {
    const [doneAuth, setDoneAuth] = useState(false);
    const autoLogin = useAutoLogin();
    useEffect(() => {
      (async () => {
        try {
          await autoLogin();
        } catch (err) {
          console.log(err);
        } finally {
          setDoneAuth(true);
        }
      })();
    }, []);
    return (
      <LayoutComponent>
        {doneAuth ? <Router /> : <LinearProgress />}
      </LayoutComponent>
    );
  };

  export default App;
