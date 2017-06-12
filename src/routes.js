import React from 'react';
import Lesson from './components/Lesson/Lesson';
import getRouteObject from './routeObject';


const Dummy = () => {
  const html = {__html: '<div id="DoWeNeedThisId">TODO: Insert static HTML her instead</div>'};
  console.log('Inserting html:', html.__html);
  return <div dangerouslySetInnerHTML={html}/>;
};


const setPage = (wrapperObj, page) => {
  if (wrapperObj.callback) {
    wrapperObj.callback(page);
    delete wrapperObj.callback;
  } else if (!wrapperObj.page) {
    wrapperObj.page = page;
  }
};

const Wrapper = React.createClass({
  getInitialState() {
    return {showPage: !!this.props.wrapperObj.page};
  },
  componentWillMount() {
    if (!this.props.wrapperObj.page) {
      this.props.wrapperObj.callback = (page) => {
        this.props.wrapperObj.page = page;
        this.setState({showPage: true});
      };
    }
  },
  render() {
    return this.state.showPage ? <this.props.wrapperObj.page {...this.props}/> : <Dummy/>;
  }
});
Wrapper.propTypes = {
  wrapperObj: React.PropTypes.object.isRequired
};

const getComponentFrontPage = (nextState, cb) => {
  const obj = {};
  require.ensure([], require => {
    setPage(obj, require('./pages/FrontPage').FrontPageContainer);
  }, 'FrontPageContainer');
  cb(null, (props) => <Wrapper {...props} wrapperObj={obj}/>);
};

const getComponentNotFound = (nextState, cb) => {
  const obj = {};
  require.ensure([], require => {
    setPage(obj, require('./pages/PageNotFound').NotFoundContainer);
  }, 'NotFoundContainer');
  cb(null, (props) => <Wrapper {...props} wrapperObj={obj}/>);
};

const getComponentPlaylist = (nextState, cb) => {
  const obj = {};
  require.ensure([], (require) => {
    setPage(obj, require('./pages/PlaylistPage').PlaylistPageContainer);
  }, 'PlaylistPageContainer');
  cb(null, (props) => <Wrapper {...props} wrapperObj={obj}/>);
};


const getComponentLessonPage = (nextState, cb) => {
  const params = nextState.params;
  const path = `${params.course}/${params.lesson}/${params.file}`;

  const bundledLessonContext = require.context('bundle?name=[path][name]!frontAndContent!lessonSrc/', true,
    /^\.\/[^\/]*\/[^\/]*\/(?!index\.md$)[^\/]*\.md/);
  const bundle = bundledLessonContext('./' + path + '.md');
  bundle(result => {
    // How to pass props directly to component,
    // see https://stackoverflow.com/questions/33571734/with-getcomponent-how-to-pass-props/33578098#33578098
    cb(null, props => <Lesson {...props} path={path} lesson={result}/>);
  });

  // The following code was an attempt to make it look more like routes-static.js,
  // but alas it won't split the code into separate chunks / js-files per oppgave:
  //
  // require.ensure([], require => {
  //   const lessonContext = require.context('frontAndContent!lessonSrc/', true,
  //     /^\.\/[^\/]*\/[^\/]*\/(?!index\.md$|README\.md$)[^\/]*\.md/);
  //   const result = lessonContext('./' + path + '.md');
  //   // How to pass props directly to component,
  //   // see https://stackoverflow.com/questions/33571734/with-getcomponent-how-to-pass-props/33578098#33578098
  //   cb(null, props => <Lesson {...props} lesson={result}/>);
  // });
};

/*const getComponentLessonInstructionPage = (nextState, cb) => {
  const params = nextState.params;
  const path = `${params.course}/${params.lesson}/${params.file}`;

  const bundledLessonInstructionContext = require.context('bundle?name=[path][name]!frontAndContent!lessonSrc/', true,
    /^\.\/[^\/]*\/[^\/]*\/README\.md$/);
  const bundle = bundledLessonInstructionContext('./' + path + '.md');
  bundle(result => {
    cb(null, props => <Lesson {...props} lesson={result}/>);
  });

};*/


const routes = getRouteObject(getComponentFrontPage, getComponentPlaylist,
  getComponentLessonPage, getComponentNotFound);
export default routes;
