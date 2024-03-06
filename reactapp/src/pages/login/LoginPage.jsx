import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import { storeToken } from "../../service/storageService";
import ROUTES from "../../routes/ROUTES";
import useAutoLogin from "../../hooks/useAutoLogin";

const LoginPage = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorsState, setErrorsState] = useState(null);
  const navigate = useNavigate();
  const autoLogin = useAutoLogin();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      const { data } = await axios.post("http://localhost:8080/users/login", {
        email: emailValue,
        password: passwordValue,
      });
      const token = data.token;

      if (!token) {
        throw new Error("Invalid token received from the server");
      }

      console.log("Received token:", token);
      storeToken(token, rememberMe);
      toast.success("You logged in successfully 👌");
      navigate(ROUTES.HOME);
      window.location.reload();
    } catch (err) {
      console.error("Login error:", err.message);
      toast.error("Login error, please try again");
    }
  };

  const handleEmailInputChange = (e) => {
    setEmailValue(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setPasswordValue(e.target.value);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          background: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={emailValue}
              onChange={handleEmailInputChange}
            />
            {errorsState?.email && (
              <Alert severity="warning">{errorsState.email}</Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={passwordValue}
              onChange={handlePasswordInputChange}
            />
            {errorsState?.password && (
              <Alert severity="warning">{errorsState.password}</Alert>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
              }
              label="Remember me"
            />
            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Link to="/ForgotPassword">Forgot Password?</Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
