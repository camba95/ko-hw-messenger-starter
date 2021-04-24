import React from "react";
import {
  Grid,
  Button,
  FormControl,
  TextField,
  Typography,
} from "@material-ui/core";
import ConditionalElement from "../../components/ConditionalElement";

const generateTitles = () => ([
  {
    notIn: ["md", "lg", "xl"],
    render: () => <Typography align="center" variant="h5">Welcome back!</Typography>
  },
  {
    notIn: ["xs", "sm"],
    render: () => <Typography variant="h5">Welcome back!</Typography>
  },
]);

const LoginForm = (props) => {
  const { login } = props;
  const titles = generateTitles();

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    await login({ email, password });
  };

  return (
    <Grid item xs={12}>
      <form onSubmit={handleLogin}>
        <Grid>
          <ConditionalElement elements={titles} />
          <Grid>
            <FormControl
              fullWidth
              margin="normal"
              required
            >
              <TextField
                aria-label="email"
                label="E-mail address"
                name="email"
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
              label="Password"
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
  );
};

export default LoginForm;
