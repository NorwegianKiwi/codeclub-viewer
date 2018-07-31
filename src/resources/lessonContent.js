/* eslint-env node */

import {getLessonFrontmatter} from './lessonFrontmatter';
import {extractFirstPartOfHtml} from '../util';

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
    // TODO: When upgrading to webpack4, add magic comment to only include files that are included by lessonFrontmatter
    import(`lessonSrc/${course}/${lesson}/${file}.md`) :
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

/**
 * Return a promise that resolves to the text in the first part of HTML markup for the lesson.
 * @param {string} course E.g. 'scratch'
 * @param {string} lesson E.g. 'astrokatt'
 * @param {string} language E.g. 'nb'
 * @param {boolean} isReadme
 * @returns {Promise} A promise that resolves to text to e.g. display in a description.
 */
export const getLessonIntroTextPromise = (course, lesson, language, isReadme) =>
  getLessonIntroPromise(course, lesson, language, isReadme)
    .then(lessonIntro => lessonIntro.replace(/<[^>]*>/g, ''));
