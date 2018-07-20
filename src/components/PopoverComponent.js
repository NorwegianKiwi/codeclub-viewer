import React from 'react';
import PropTypes from 'prop-types';
import styles from './PopoverComponent.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Loadable from 'react-loadable';

let idCounter = 0;

const PopoverComponent = ({children, popoverContent}) => {
  const createMarkup = (sanitizedContent) => {
    return {__html: sanitizedContent};
  };
  const animation = true;
  const trigger = 'click';
  const placement = 'bottom';
  const onClick = (e) => e.preventDefault();

  const LoadablePopoverContent = Loadable({
    // Using Promise.resolve to convert a normal value (e.g. string) into a promise, if it is not already a promise:
    loader: () => Promise.resolve(popoverContent),
    loading:  () => <div>Loading...</div>,
    render: (loaded) => <div className={styles.content} dangerouslySetInnerHTML={createMarkup(loaded)}/>,
  });

  const overlay = (
    <Popover id={`PopoverComponent_id_${++idCounter}`} className={styles.popover} shouldUpdatePosition={true}>
      <LoadablePopoverContent/>
    </Popover>
  );
  // Using Promise.resolve to convert a normal value (e.g. string) into a promise, if it is not already a promise
  return (
    <OverlayTrigger rootClose {...{animation, placement, trigger, onClick, overlay}}>
      {children}
    </OverlayTrigger>
  );
};

PopoverComponent.propTypes = {
  // ownProps
  children: PropTypes.node,

  // popoverContent can be both a normal value/string/node etc, or a promise that resolves to one of these
  popoverContent: PropTypes.any,
};

export default withStyles(styles)(PopoverComponent);
