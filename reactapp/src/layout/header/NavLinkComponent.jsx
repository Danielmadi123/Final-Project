import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const NavLinkComponent = ({ to, children }) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Typography
          color={isActive ? "#fff" : "#000"}
          sx={{ p: 2 }}
          variant="h6"
        >
          {children}
        </Typography>
      )}
    </NavLink>
  );
};
export default NavLinkComponent;
