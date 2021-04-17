import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  Container,
  SvgIcon
} from "@material-ui/core";
import { register } from "../../store/utils/thunkCreators";
import background from "../../assets/bg-img.png";
import { ReactComponent as BubbleIcon } from '../../assets/bubble.svg';

import './Signup.css'

const Login = (props) => {
  const history = useHistory();
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

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
          <form onSubmit={handleRegister}>
            <Grid>
              <Typography variant="h5">Create an account.</Typography>
              <Grid>
                <FormControl
                  fullWidth
                  margin="normal"
                >
                  <TextField
                    aria-label="username"
                    label="Username"
                    name="username"
                    type="text"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid>
                <FormControl
                  fullWidth
                  margin="normal"
                >
                  <TextField
                    label="E-mail address"
                    aria-label="e-mail address"
                    type="email"
                    name="email"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid>
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!formErrorMessage.confirmPassword}
                >
                  <TextField
                    aria-label="password"
                    label="Password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="password"
                    required
                  />
                  <FormHelperText>
                    {formErrorMessage.confirmPassword}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid>
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!formErrorMessage.confirmPassword}
                >
                  <TextField
                    label="Confirm Password"
                    aria-label="confirm password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="confirmPassword"
                    required
                  />
                  <FormHelperText>
                    {formErrorMessage.confirmPassword}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                container
                item
                justify="center"
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="primary"
                >
                  Create
              </Button>
              </Grid>
            </Grid>
          </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
