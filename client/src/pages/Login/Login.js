import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
} from "@material-ui/core";

import SideBanner from "../../components/SideBanner";
import { login } from "../../store/utils/thunkCreators";

const Login = (props) => {
  const history = useHistory();
  const { user, login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

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
        <form onSubmit={handleLogin}>
          <Grid>
            <Grid>
              <FormControl
                fullWidth
                margin="normal"
                required
              >
                <TextField
                  aria-label="username"
                  label="Username"
                  name="username"
                  type="text"
                />
              </FormControl>
            </Grid>
            <FormControl
              fullWidth
              margin="normal"
              required
            >
              <TextField
                label="password"
                aria-label="password"
                type="password"
                name="password"
              />
            </FormControl>
            <Grid
              container
              item
              justify="center"
            >
              <Button
                color="primary"
                type="submit"
                variant="contained"
                size="large"
              >
                Login
                </Button>
            </Grid>
          </Grid>
        </form>
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
