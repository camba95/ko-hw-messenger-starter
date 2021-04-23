import React from "react";
import classNames from "classnames";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import BubbleIcon from "../BubbleIcon";
import sideBannerImg from "../../assets/bg-img.png"

const useStyles = makeStyles({
  sideBanner: {
    height: "100vh",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  sideBannerBackground: {
    backgroundImage: `linear-gradient(to bottom, rgba(58, 141, 255, 0.85), rgba(134, 185, 255, 0.85)), url(${sideBannerImg})`,
  },
  sideBannerBubble: {
    margin: '20px',
  }
});

const SideBanner = (props) => {
  const classes = useStyles();
  const { children } = props;

  return (
    <Grid
      container
      justify="flex-start"
      alignItems="stretch"
    >
      <Grid item lg={5} md={5}>
        <div className={classNames(classes.sideBanner, classes.sideBannerBackground)}>
          <div >
            <Grid container justify="center">
              <div className={classes.sideBannerBubble}>
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
