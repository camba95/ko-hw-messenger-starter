import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
} from "@material-ui/core";

const SingupForm = (props) => {
  const { register } = props;
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

  return (
    <Grid item xs={12}>
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
              {formErrorMessage.confirmPassword && (
                <FormHelperText>
                  {formErrorMessage.confirmPassword}
                </FormHelperText>
              )}
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
              {formErrorMessage.confirmPassword && (
                <FormHelperText>
                  {formErrorMessage.confirmPassword}
                </FormHelperText>
              )}
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
    </Grid>
  );
};

export default SingupForm;
