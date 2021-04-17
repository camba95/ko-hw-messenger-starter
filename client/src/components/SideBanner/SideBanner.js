import React from "react";
import { Grid, Typography } from "@material-ui/core";

import { ReactComponent as BubbleIcon } from "../../assets/bubble.svg";

import "./SideBanner.css";

const SideBanner = (props) => {
  const { children } = props;
  return (
    <Grid
      container
      justify="flex-start"
      alignItems="stretch"
    >
      <Grid item lg={5} md={5}>
        <div className="side-banner side-banner__background">
          <div className="side-banner__text-box">
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
      <Grid item md={7} lg={7}>
        {children}
      </Grid>
    </Grid>
  )
};

export default SideBanner;
