import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import Box from "@mui/material/Box";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  //const name=JSON.parse(window.localStorage.getItem('userInfo'));
  //  console.log(children);
  const backToExplore = () => {
    history.push('/');
  }
  const logOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("balance");
    enqueueSnackbar("Logged out", {
      variant: 'success',
    })
    history.push("/")
    window.location.reload();

  }
  const logOutButton = <Stack direction="row" spacing={2} alignItems="center" key="logout">
    {/* <Avatar  src="../../public/avatar.png" /> */}

    {/* <Avatar src="../../public/avatar.png" ></Avatar> */}
    <Avatar src="avatar.png" alt="crio.do" />
    <p>{localStorage.getItem('username')}</p>
    <Button onClick={logOut}
    >LOGOUT</Button>
  </Stack>
  const loginAndResisterButton = <Stack direction="row" spacing={2} alignItems="center" key="login">
    <Link className="link" to="/login"><Button variant="text">LOGIN</Button></Link>
    <Link className="link" to="/register"><Button variant="contained">REGISTER</Button></Link>
  </Stack>
  const backToExploreButton = <Stack><Button
    className="explore-button"
    startIcon={<ArrowBackIcon />}
    variant="text"
    onClick={backToExplore}
  >
    Back to explore
  </Button></Stack>
  const buttonCheck=localStorage.getItem('username')?[children,logOutButton]:[children,loginAndResisterButton];
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {hasHiddenAuthButtons? buttonCheck
                                   : backToExploreButton }  
      
    </Box>
  );
};

export default Header;
