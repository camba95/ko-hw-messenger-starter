import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, Box, Hidden } from "@material-ui/core";

import SideBanner from "../SideBanner";

const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: "100%"
  },
  formContainer: {
    display: "flex",
    flex: 1,
    width: "60%",
    margin: "0 auto",
    marginTop: "10rem",
    [theme.breakpoints.down('sm')]: {
      marginTop: "2rem",
    },
  }
}));

const LoginTemplate = (props) => {
  const classes = useStyles();

  const form = (
    <Box className={classes.root}>
      <Grid container justify="flex-end" alignItems="center">
        <Hidden smDown>
          <Box m={2}>
            {props.headerText}
          </Box>
        </Hidden>
        <Box m={2}>
          {props.headerButton}
        </Box>
      </Grid>
      <Box className={classes.formContainer}>
        <Grid container>
          {props.formIcon && (
            <Hidden smUp>
              <Box mx="auto" mb={2}>
                {props.formIcon}
              </Box>
            </Hidden>
          )}
          {props.children}
        </Grid>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden smDown>
        <SideBanner >
          {form}
        </SideBanner>
      </Hidden>
      <Hidden mdUp>
        {form}
      </Hidden>
    </>
  );
};

export default LoginTemplate;
