import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Box,
  Button,
  Hidden
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import SignupForm from "./SignupForm";
import SideBanner from "../../components/SideBanner";
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

const Signup = (props) => {
  const { user, register } = props;
  const history = useHistory();
  const classes = useStyles();

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
          {renderLoginButton(history)}
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

const renderLoginButton = (history) => (
  <>
    <Hidden smUp>
      <Button
        size="medium"
        color="secondary"
        variant="outlined"
        onClick={() => history.push("/login")}
      >
        Login
      </Button>
    </Hidden>
    <Hidden smDown>
      <Button
        size="large"
        color="secondary"
        variant="contained"
        onClick={() => history.push("/login")}
      >
        Login
      </Button>
    </Hidden>
  </>
);

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
