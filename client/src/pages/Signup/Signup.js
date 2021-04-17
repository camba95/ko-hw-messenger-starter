import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Box,
  Button
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
      direction="row"
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
      <Grid md={7} lg={7}>
        <Box>
          <Grid container item justify="flex-end">
            <Typography>Need to log in?</Typography>
            <Button
              size="large"
              color="primary"
              onClick={() => history.push("/login")}
            >
              Login
            </Button>
          </Grid>
          <SignupForm register={register} />
        </Box>
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
