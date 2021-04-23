import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Typography, Button } from "@material-ui/core";

import SignupForm from "./SignupForm";
import LoginTemplate from "../../components/Templates/LoginTemplate";
import ConditionalElement from "../../components/ConditionalElement";
import { register } from "../../store/utils/thunkCreators";

const generateButtons = (history) => ([
  {
    notIn: ["md", "lg", "xl"],
    render: () => (
      <Button
        size="medium"
        color="secondary"
        variant="outlined"
        onClick={() => history.push("/login")}
      >
        Login
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
        onClick={() => history.push("/login")}
      >
        Login
      </Button>
    )
  },
]);

const Signup = (props) => {
  const { user, register } = props;
  const history = useHistory();
  const loginButtons = generateButtons(history);

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <LoginTemplate
      headerText={<Typography>Already have an account?</Typography>}
      headerButton={<ConditionalElement elements={loginButtons} />}
    >
      <SignupForm register={register} />
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
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
