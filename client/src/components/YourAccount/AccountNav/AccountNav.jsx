import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import { postLogout } from "../../../utils/login";


import s from "./AccountNav.module.css";

export default function AccountNav() {
  const logOutClear = async () => {
    document.cookie = "userId=; max-age=0";
    await postLogout();
  };

  return (
    <div>
      <div className={s.nav}>
        <IconButton color="secondary" component={Link} to="/home">
          <HomeIcon />
        </IconButton>
        <p className={s.yourAccount}>Your Account</p>

        <div className={s.logOut}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={logOutClear}
            >
              LOG OUT
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
