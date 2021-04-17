import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button
} from "@material-ui/core";

import LoginForm from "./LoginForm";
import SideBanner from "../../components/SideBanner";
import { login } from "../../store/utils/thunkCreators";

const Login = (props) => {
  const history = useHistory();
  const { user, login } = props;

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <SideBanner>
      <Grid container direction="column" justify="flex-start" alignItems="stretch">
        <Grid container item justify="flex-end" alignItems="center">
          <Box m={2}>
            <Typography>Need to register?</Typography>
          </Box>
          <Box m={2}>
            <Button
              size="large"
              color="secondary"
              variant="contained"
              onClick={() => history.push("/register")}
            >
              Register
            </Button>
          </Box>
        </Grid>
        <Box height="100%" display="flex" flex="1">
          <Grid container item justify="center" alignItems="center">
            <Box width="60%">
              <LoginForm login={login} />
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
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
