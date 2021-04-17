import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Box,
  Button,
  Container
} from "@material-ui/core";

import SignupForm from "./SignupForm";
import { register } from "../../store/utils/thunkCreators";
import { ReactComponent as BubbleIcon } from '../../assets/bubble.svg';

import './Signup.css';

const Signup = (props) => {
  const { user, register } = props;
  const history = useHistory();

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid
      container
      justify="flex-start"
      alignItems="stretch"
    >
      <Grid item lg={5} md={5} justify="center">
        <div class="side-banner side-banner__background">
          <div class="side-banner__text-box">
            <Grid container justify="center">
              <div className="side-banner__bubble">
                <BubbleIcon />
              </div>
              <Typography variant="h4" align="center" color="secondary">
                Converse with anyone with any language
              </Typography>
            </Grid>
          </div>
        </div>
      </Grid>
      <Grid item md={7} lg={7}>
        <Grid container direction="column" justify="flex-start" alignItems="stretch">
          <Grid container item justify="flex-end" alignItems="center">
            <Box m={2}>
              <Typography>Need to log in?</Typography>
            </Box>
            <Box m={2}>
              <Button
                size="large"
                color="secondary"
                variant="contained"
                onClick={() => history.push("/login")}
              >
                Login
                </Button>
            </Box>
          </Grid>
          <Box height="100%" display="flex" flex="1">
            <Grid container item justify="center" alignItems="center">
              <Box width="60%">
                <SignupForm register={register} />
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
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
