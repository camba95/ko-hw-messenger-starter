import React from "react";
import {
  Grid,
  Button,
  FormControl,
  TextField,
  Typography
} from "@material-ui/core";

const LoginForm = (props) => {
  const { login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  return (
    <form onSubmit={handleLogin}>
      <Grid>
        <Typography variant="h5">Welcome back!</Typography>
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
  );
};

export default LoginForm;
