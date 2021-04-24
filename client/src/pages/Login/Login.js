import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Typography, Button } from "@material-ui/core";

import LoginForm from "./LoginForm";
import ConditionalElement from "../../components/ConditionalElement";
import LoginTemplate from "../../components/Templates/LoginTemplate";
import { login } from "../../store/utils/thunkCreators";

import BubbleIcon from "../../components/BubbleIcon";

const generateButtons = (history) => ([
  {
    notIn: ["md", "lg", "xl"],
    render: () => (
      <Button
        size="medium"
        color="secondary"
        variant="outlined"
        onClick={() => history.push("/register")}
      >
        Create account
      </Button>
    )
  },
  {
    notIn: ["xs", "sm"],
    render: () => (
      <Button
        size="large"
        color="secondary"
        variant="contained"
        onClick={() => history.push("/register")}
      >
        Create account
      </Button>
    )
  },
]);

const Login = (props) => {
  const history = useHistory();

  const signupButtons = generateButtons(history);

  const { user, login } = props;

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <LoginTemplate
      formIcon={<BubbleIcon fill="#3A8DFF" />}
      headerText={<Typography>Don't have an account?</Typography>}
      headerButton={<ConditionalElement elements={signupButtons} />}
    >
      <LoginForm login={login} />
    </LoginTemplate>
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
