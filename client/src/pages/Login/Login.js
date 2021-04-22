import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Box,
  Typography,
  Button
} from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';

import LoginForm from "./LoginForm";
import SideBanner from "../../components/SideBanner";
import { login } from "../../store/utils/thunkCreators";

import BubbleIcon from "../../components/BubbleIcon";

const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: "100%"
  },
  formContainer: {
    display: "flex",
    flex: 1,
    width: "60%",
    margin: "0 auto",
    marginTop: "10rem",
    [theme.breakpoints.down('sm')]: {
      marginTop: "2rem",
    },
  }
}));

const Login = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const smallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const { user, login } = props;

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <SideBanner>
      <Box className={classes.root}>
        <Grid container justify="flex-end" alignItems="center">
          {!smallScreen && (
            <Box m={2}>
              <Typography>Don't have an account?</Typography>
            </Box>
          )}
          <Box m={2}>
            {renderCreateAccountButton(smallScreen, history)}
          </Box>
        </Grid>
        <Box className={classes.formContainer}>
          <Grid container>
            {smallScreen && (
              <Box mx="auto" mb={2}>
                <BubbleIcon fill="#3A8DFF" />
              </Box>
            )}
            <LoginForm login={login} />
          </Grid>
        </Box>
      </Box>
    </SideBanner>
  );
};

const renderCreateAccountButton = (smallScreen, history) => {
  if (smallScreen) {
    return (
      <Button
        size="large"
        color="secondary"
        variant="outlined"
        onClick={() => history.push("/register")}
      >
        Create account
      </Button>
    );
  }
  return (
    <Button
      size="large"
      color="secondary"
      variant="contained"
      onClick={() => history.push("/register")}
    >
      Create account
    </Button>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
