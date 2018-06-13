/* eslint-env node */

import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import App from './pages/App';
import FrontPage from './pages/FrontPage';
import PageNotFound from './pages/PageNotFound';
import Lesson from './components/Lesson/Lesson';
import CoursePage from './pages/CoursePage';

import {isValidCourse} from './resources/courseFrontmatter';
import {isValidLesson} from './resources/lessonFrontmatter';

const getCoursePage = ({params}, callback) => {
  const returnPage = isValidCourse(params.course) ? CoursePage : PageNotFound;
  callback(null, returnPage);
};

const getLessonPage = ({params}, callback) => {
  const {course, lesson, file} = params;
  const returnPage = isValidLesson(course, lesson, file) ? Lesson : PageNotFound;
  callback(null, returnPage);
};

/**
 * Rewrites /index* to / and removes .html from the end of any path.
 * Keeps query parameters unchanged (e.g. ?a=1&b=2, found in location.search)
 */
const rewritePath = (nextState, replace) => {
  const nextpath = nextState.location.pathname;
  if (nextpath.startsWith('/index')) {
    if (typeof document !== 'undefined') {
      replace('/' + nextState.location.search);
    } else {
      console.error('The router cannot handle paths that start with /index' +
        ' when rendering static pages (' + nextpath + ')');
    }
  }
  else if (nextpath.endsWith('.html')) {
    if (typeof document !== 'undefined') {
      replace(nextpath.replace(/\.html$/, '') + nextState.location.search);
    } else {
      console.error('The router cannot handle paths that end in .html' +
        ' when rendering static pages (' + nextpath + ')');
    }
  }
};

const appOnEnter = (nextState, replace) => {
  rewritePath(nextState, replace);
};

const appOnChange = (prevState, nextState, replace) => {
  rewritePath(nextState, replace);
};

const routes =
  <Route path="/" component={App} onEnter={appOnEnter} onChange={appOnChange}>
    <IndexRoute component={FrontPage}/>
    <Route path="/:course" getComponent={getCoursePage}/>
    <Route path="/:course/:lesson/:file" getComponent={getLessonPage}/>
    <Route path="*" component={PageNotFound}/>
  </Route>;

export default routes;
