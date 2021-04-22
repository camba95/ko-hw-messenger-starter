import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Box,
  Hidden,
  Button
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import SignupForm from "./SignupForm";
import SideBanner from "../../components/SideBanner";
import ConditionalElement from "../../components/ConditionalElement";
import { register } from "../../store/utils/thunkCreators";

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
        onClick={() => history.push("/login")}
      >
        Login
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
        onClick={() => history.push("/login")}
      >
        Login
      </Button>
    )
  },
]);

const Signup = (props) => {
  const { user, register } = props;
  const history = useHistory();
  const classes = useStyles();
  const signupButtons = generateButtons(history);

  if (user.id) {
    return <Redirect to="/home" />;
  }

  const form = (
    <Box className={classes.root}>
      <Grid container justify="flex-end" alignItems="center">
        <Hidden smDown>
          <Box m={2}>
            <Typography>Already have an account?</Typography>
          </Box>
        </Hidden>
        <Box m={2}>
          <ConditionalElement elements={signupButtons} />
        </Box>
      </Grid>
      <Box className={classes.formContainer}>
        <Grid container>
          <SignupForm register={register} />
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
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
