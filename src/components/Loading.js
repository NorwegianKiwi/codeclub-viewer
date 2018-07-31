import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import styles from './Loading.scss';
import {getTranslator} from '../selectors/translate';

const Loading = ({error, t}) => {
  return (
    <div className={styles.container}>
      {error ?
        <span>
          <Glyphicon glyph='exclamation-sign'/>
          <span className={styles.text}>{t('general.loadingfailed')}!</span>
        </span> :
        <span>
          <Glyphicon className={styles.rotate} glyph='refresh'/>
          <span className={styles.text}>{t('general.loading')}...</span>
        </span>
      }
    </div>
  );
};
Loading.propTypes = {
  // ownProps
  error: PropTypes.string,

  // mapStateToProps
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  t: getTranslator(state),
});

export default connect(
  mapStateToProps,
)(withStyles(styles)(Loading));
