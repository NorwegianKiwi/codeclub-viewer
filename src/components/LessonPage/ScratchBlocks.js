import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './ScratchBlocks.scss';
import scratchblocks from 'scratchblocks/browser/scratchblocks.js';

const ScratchBlocks = ({scratchCode, inline, isHydrated}) => {
  if (isHydrated) {
    const SVG = {__html: scratchblocks(scratchCode, {inline})};
    return <span dangerouslySetInnerHTML={SVG}/>;
  } else {
    return inline ?
      <code className={styles.inline}>{scratchCode.trim()}</code> :
      <pre className={styles.blocks}>{scratchCode.trim()}</pre>;
  }
};

ScratchBlocks.propTypes = {
  // ownProps
  scratchCode: PropTypes.string,
  inline: PropTypes.bool,

  // mapStateToProps
  isHydrated: PropTypes.bool.isRequired, // require isHydrated as a prop to force rerender when it changes
};

const mapStateToProps = (state) => ({
  isHydrated: state.hydration,
});

export default connect(
  mapStateToProps,
)(withStyles(styles)(ScratchBlocks));
