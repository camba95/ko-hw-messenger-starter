import React from "react";
import { Button, Hidden } from "@material-ui/core";

const RedirectButton = (props) => (
  <>
    <Hidden smUp>
      <Button
        size="medium"
        color="secondary"
        variant="outlined"
        onClick={props.onClick}
      >
        {props.children}
      </Button>
    </Hidden>
    <Hidden smDown>
      <Button
        size="large"
        color="secondary"
        variant="contained"
        onClick={props.onClick}
      >
        {props.children}
      </Button>
    </Hidden>
  </>
);

export default RedirectButton;
