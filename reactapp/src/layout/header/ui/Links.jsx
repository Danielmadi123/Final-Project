import { Box } from "@mui/material";
import nextKey from "generate-my-key";
import myLinks, {
  alwaysLinks,
  loggedInLinks,
  loggedOutLinks,
  isBusiness,
  isAdmin,
} from "../../myLinks";
import NavLinkComponent from "../NavLinkComponent";
import { useSelector } from "react-redux";

const Links = () => {
  const loggedIn = useSelector((bigPie) => bigPie.authSlice.loggedIn);
  const businessUser = useSelector((bigPie) => bigPie.authSlice.isBusiness);
  const adminUser = useSelector((bigPie) => bigPie.authSlice.isAdmin);
  let userLinks = [];
  let adminLinks = [];
  let businessLinks = [];

  if (adminUser) {
    adminLinks = isAdmin;
  }

  if (businessUser) {
    businessLinks = isBusiness;
  }

  userLinks = adminUser ? adminLinks : businessLinks;

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
      {alwaysLinks.map((myItem) => (
        <NavLinkComponent to={myItem.to} key={nextKey()}>
          {myItem.children}
        </NavLinkComponent>
      ))}
      {loggedIn &&
        loggedInLinks.map((myItem) => (
          <NavLinkComponent to={myItem.to} key={nextKey()}>
            {myItem.children}
          </NavLinkComponent>
        ))}
      {!loggedIn &&
        loggedOutLinks.map((myItem) => (
          <NavLinkComponent to={myItem.to} key={nextKey()}>
            {myItem.children}
          </NavLinkComponent>
        ))}
      {userLinks.map((myItem) => (
        <NavLinkComponent to={myItem.to} key={nextKey()}>
          {myItem.children}
        </NavLinkComponent>
      ))}
    </Box>
  );
};

export default Links;
