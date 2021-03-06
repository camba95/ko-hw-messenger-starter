import React, { useEffect, useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchUser, connectSocket } from "./store/utils/thunkCreators";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Home, SnackbarError } from "./components";

const Routes = (props) => {
  const { user, fetchUser, connectSocket } = props;
  const [errorMessage, setErrorMessage] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user.error) {
      // check to make sure error is what we expect, in case we get an unexpected server error object
      if (typeof user.error === "string") {
        setErrorMessage(user.error);
      } else {
        setErrorMessage("Internal Server Error. Please try again");
      }
      setSnackBarOpen(true);
      return;
    }
  }, [user.error]);

  useEffect(() => {
    if (user.id) {
      connectSocket(user.id);
    }
  }, [user.id, connectSocket]);

  if (props.user.isFetchingUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {snackBarOpen && (
        <SnackbarError
          setSnackBarOpen={setSnackBarOpen}
          errorMessage={errorMessage}
          snackBarOpen={snackBarOpen}
        />
      )}
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Signup} />
        <Route
          exact
          path="/"
          render={(props) => (props.user?.id ? <Home /> : <Login />)}
        />
        <Route path="/home" component={Home} />
      </Switch>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser() {
      dispatch(fetchUser());
    },
    connectSocket(id) {
      dispatch(connectSocket(id));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
