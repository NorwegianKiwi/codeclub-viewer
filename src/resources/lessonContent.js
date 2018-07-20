/* eslint-env node */

import {getLessonFrontmatter} from './lessonFrontmatter';
import {extractFirstPartOfHtml} from '../util';

// Gets all lessonSrc/*/*/*.md except lessonSrc/*/playlists/*
// Gets only frontmatter (includes README-files, i.e. lærerveiledninger/teacher instructions)
// The keys are of the form './course/lesson/file.md'
// Note that the regex should be identical to the one for lessonFrontmatter.js.
//const lessonContentContext =
//  require.context('lessonSrc/', true, /^[.][/][^/]+[/](?!playlists[/])[^/]+[/][^.]+[.]md$/);

// function delayPromise(duration) {
//   return function(...args){
//     return new Promise(function(resolve, reject){
//       setTimeout(function(){
//         resolve(...args);
//       }, duration);
//     });
//   };
// }


/**
 * Return a promise that resolves to the HTML markup for the lesson.
 * @param {string} course E.g. 'scratch'
 * @param {string} lesson E.g. 'astrokatt'
 * @param {string} language E.g. 'nb'
 * @param {boolean} isReadme
 * @return {Promise} A promise that resolves to HTML markup
 */
export const getLessonContentPromise = (course, lesson, language, isReadme) => {
  const {file} = getLessonFrontmatter(course, lesson, language, isReadme);
  return file ?
    import(`lessonSrc/${course}/${lesson}/${file}.md`) /*.then(delayPromise(5000))*/ :
    Promise.reject(`Could not retrieve content for ${course}/${lesson}/${file}`);
};

/**
 * Return a promise that resolves to the first part of HTML markup for the lesson.
 * @param {string} course E.g. 'scratch'
 * @param {string} lesson E.g. 'astrokatt'
 * @param {string} language E.g. 'nb'
 * @param {boolean} isReadme
 * @returns {Promise} A promise that resolves to HTML code to e.g. display in a popover.
 */
export const getLessonIntroPromise = (course, lesson, language, isReadme) => {
  const lessonContentPromise = getLessonContentPromise(course, lesson, language, isReadme);
  const {path} = getLessonFrontmatter(course, lesson, language, isReadme);
  return path ?
    lessonContentPromise.then(lessonContent => extractFirstPartOfHtml(lessonContent, path)) :
    Promise.reject(`Could not retrieve intro for ${path}`);
};
