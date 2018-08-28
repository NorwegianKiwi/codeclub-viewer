//import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Content.scss';
//import {processContent} from '../../utils/processContent';
import htmlToReact from '../../utils/htmlToReact';
import {getLessonContent} from '../../resources/lessonContent';

// const createMarkup = (lessonContent, isHydrated) => {
//   //console.log('unprocessed:', lessonContent);
//   const __html = processContent(lessonContent, styles, isHydrated);
//   //console.log('__html:', __html);
//   return {__html};
// };

// const Loading = () => <div>Loading...</div>;
//
// const getLesson = (path) => Loadable({
//   loader: () => import('./Content'),
//   loading: Loading,
// });

//console.log('lessonContext.keys:', lessonContext.keys());

const Content = ({course, lesson, language, isReadme, isHydrated}) => {
  const lessonContent = getLessonContent(course, lesson, language, isReadme);
  //return <div dangerouslySetInnerHTML={createMarkup(lessonContent, isHydrated)}/>;
  //return htmlToReact(processContent(lessonContent, styles, isHydrated));
  return htmlToReact(lessonContent, styles, isHydrated);
};
Content.propTypes = {
  // ownProps
  course: PropTypes.string.isRequired,
  lesson: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  isReadme: PropTypes.bool.isRequired,

  // mapStateToProps
  isHydrated: PropTypes.bool.isRequired, // require isHydrated as a prop to force rerender when it changes
};

const mapStateToProps = (state) => ({
  isHydrated: state.hydration,
});

export default connect(
  mapStateToProps,
)(withStyles(styles)(Content));
