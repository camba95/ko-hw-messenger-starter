import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Box,
  Typography,
  Hidden,
  Button
} from "@material-ui/core";

import LoginForm from "./LoginForm";
import SideBanner from "../../components/SideBanner";
import ConditionalElement from "../../components/ConditionalElement";
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

const generateButtons = (history) => ([
  {
    notIn: ["md", "lg", "xl"],
    render: () => (
      <Button
        size="medium"
        color="secondary"
        variant="outlined"
        onClick={() => history.push("/register")}
      >
        Create account
      </Button>
    )
  },
  {
    notIn: ["xs", "sm"],
    render: () => (
      <Button
        size="large"
        color="secondary"
        variant="contained"
        onClick={() => history.push("/register")}
      >
        Create account
      </Button>
    )
  },
]);

const Login = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const signupButtons = generateButtons(history);

  const { user, login } = props;

  if (user.id) {
    return <Redirect to="/home" />;
  }

  const form = (
    <Box className={classes.root}>
      <Grid container justify="flex-end" alignItems="center">
        <Hidden smDown>
          <Box m={2}>
            <Typography>Don't have an account?</Typography>
          </Box>
        </Hidden>
        <Box m={2}>
          <ConditionalElement elements={signupButtons} />
        </Box>
      </Grid>
      <Box className={classes.formContainer}>
        <Grid container>
          <Hidden smUp>
            <Box mx="auto" mb={2}>
              <BubbleIcon fill="#3A8DFF" />
            </Box>
          </Hidden>
          <LoginForm login={login} />
        </Grid>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden smDown>
        <SideBanner >
          {form}
        </SideBanner>
      </Hidden>
      <Hidden smUp>
        {form}
      </Hidden>
    </>
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
