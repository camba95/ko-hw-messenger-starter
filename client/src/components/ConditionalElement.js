import React from "react";
import shortid from "shortid";
import { Hidden } from "@material-ui/core";

const ConditionalElement = (props) => {
  const { elements } = props
  if (!Array.isArray(elements)) {
    return console.error("elements should be an array of objects");
  }
  return (
    <>
      {elements.map((current) => {
        if (!Array.isArray(current.notIn)) {
          return console.error("notIn should be an array of strings");
        }
        if (!(current.render instanceof Function)) {
          return console.error("render should be a function");
        }
        return (
          <Hidden only={current.notIn} key={shortid()}>
            {current.render()}
          </Hidden>
        );
      })}
    </>
  )
};

export default ConditionalElement;
