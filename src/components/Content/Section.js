import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Section.scss';

const Section = ({type, children}) => {
  const classNames = [styles.styledList];
  if (styles[type]) { classNames.push(styles[type]); }
  return <section className={classNames.join(' ')}>
    {children}
  </section>;
};

Section.propTypes = {
  type: PropTypes.string,
};

export default withStyles(styles)(Section);
