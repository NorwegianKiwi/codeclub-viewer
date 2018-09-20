import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Section.scss';

const Section = ({className, children}) => {
  return <section className={styles[className] || className || null}>
    {children}
  </section>;
};

Section.propTypes = {
  className: PropTypes.string,
};

export default withStyles(styles)(Section);
