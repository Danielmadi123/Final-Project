import ROUTES from "../routes/ROUTES";

const myLinks = [
  { to: ROUTES.ABOUT, children: "About" },
  { to: ROUTES.HOME, children: "Home page" },
  { to: ROUTES.REGISTER, children: "Register page" },
  { to: ROUTES.LOGIN, children: "Login page" },
  { to: ROUTES.FAVCARD, children: "Favr Cards" },
  { to: ROUTES.MYCARDS, children: "My Cards" },
  { to: ROUTES.SANDBOX, children: "Sandbox" },
];

const alwaysLinks = [{ to: ROUTES.ABOUT, children: "About" }];

const loggedInLinks = [{ to: ROUTES.FAVCARD, children: "Favorite" }];

const loggedOutLinks = [
  { to: ROUTES.REGISTER, children: "Sign up" },
  { to: ROUTES.LOGIN, children: "Login" },
];

const isBusiness = [{ to: ROUTES.MYCARDS, children: "My Cards" }];
const isAdmin = [
  { to: ROUTES.MYCARDS, children: "My Cards" },
  { to: ROUTES.SANDBOX, children: "Sandbox" },
];

const UserLinks = ({ isBusiness, isAdmin }) => {
  if (isBusiness && isAdmin) {
    return isAdmin;
  } else {
    return isBusiness;
  }
};

export {
  myLinks,
  alwaysLinks,
  loggedInLinks,
  loggedOutLinks,
  isBusiness,
  isAdmin,
  UserLinks,
};
