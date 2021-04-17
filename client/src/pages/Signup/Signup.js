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
import SideBanner from "../../components/SideBanner";
import { register } from "../../store/utils/thunkCreators";

const Signup = (props) => {
  const { user, register } = props;
  const history = useHistory();

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <SideBanner>
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
    </SideBanner>
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
