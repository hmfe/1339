import React, { Fragment } from "react";
import PropTypes from "prop-types";

export const Conditional = props => {
  if (!props.show || React.Children.count(props.children) === 0) {
    return null;
  }
  return <Fragment>{props.children}</Fragment>;
};

Conditional.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node
};
