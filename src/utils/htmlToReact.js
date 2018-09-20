// Inspired by https://github.com/utatti/react-render-html/blob/master/index.js
import React from 'react';
import convertAttr from 'react-attr-converter';
import parse5 from 'parse5';
import styleParser from './styleParser';
import ToggleButton from '../components/Content/ToggleButton';
import ScratchBlocks from '../components/Content/ScratchBlocks';
import Section from '../components/Content/Section';
import Heading1 from '../components/Content/Heading1';
import Heading2 from '../components/Content/Heading2';
import TaskList from '../components/Content/TaskList';
import ScratchText from '../components/Content/ScratchText';

/**
 *
 * The parse5.parseFragment() returns the following tree:
 * {
 *   nodeName: '#document-fragment',
 *   childNodes: [
 *     {
 *       nodeName: 'h1',
 *       tagName: 'h1',
 *       attrs: [
 *         {name: 'class', value: 'myClass'},
 *         ...
 *       ],
 *       namespaceURI: 'http://www.w3.org/1999/xhtml',
 *       childNodes: [
 *         {...},
 *         ...
 *       ],
 *       parentNode: {nodeName: '#document-fragment', childNodes: [ ... ]},
 *     },
 *     {
 *       nodeName: '#text',
 *       value: 'Any text or perhaps a line shift',
 *       parentNode: {nodeName: '#document-fragment', childNodes: [ ... ]},
 *     },
 *     ...
 *   ]
 * }
 */

const getAttribute = (attrs, attrName) => {
  for (let attr of attrs) {
    if (attr.name === attrName) {
      return attr.value;
    }
  }
  return null;
};

const getFirstChildWithTagname = (node, tagName) => {
  for (const child of node.childNodes) {
    if (child.tagName === tagName) {
      return child;
    }
  }
  return null;
};

const getTextContent = (node) => {
  for (const child of node.childNodes) {
    if (child.nodeName === '#text') {
      return child.value;
    }
  }
  return '';
};

const AstNodeToReact = (node, key) => {
  if (node.nodeName === '#text' || node.nodeName === '#comment') {
    return node.value;
  }

  const attr = node.attrs.reduce( (result, attr) => {
    const name = convertAttr(attr.name);
    result[name] = name === 'style' ? styleParser(attr.value) : attr.value;
    return result;
  }, {key: key});

  if (node.childNodes.length === 0) {
    return React.createElement(node.tagName, attr);
  }

  if (node.nodeName === 'script') {
    attr.dangerouslySetInnerHTML = {__html: node.childNodes[0].value};
    return React.createElement('script', attr);
  }

  // Extra replacements, perhaps extract (include scripts?):
  if (node.nodeName === 'toggle') {
    const strongNode = getFirstChildWithTagname(node, 'strong');
    attr.buttonText = strongNode ? getTextContent(strongNode) : 'Hint';
    const hiddenNode = getFirstChildWithTagname(node, 'hide');
    const children = hiddenNode ? hiddenNode.childNodes.map(AstNodeToReact) : '';
    return React.createElement(ToggleButton, attr, children);
  }

  const nodeClass = getAttribute(node.attrs, 'class');
  const isPre = node.nodeName === 'pre' && nodeClass === 'blocks';
  const isCode = node.nodeName === 'code' && nodeClass === 'b';
  if (isPre || isCode) {
    attr.scratchCode = getTextContent(node);
    attr.inline = isCode;
    return React.createElement(ScratchBlocks, attr);
  }

  if (node.nodeName === 'code' && nodeClass && nodeClass.startsWith('block')) {
    attr.type = nodeClass;
    const children = node.childNodes.map(AstNodeToReact);
    return React.createElement(ScratchText, attr, children);
  }

  if (node.nodeName === 'section') {
    attr.type = nodeClass;
    const children = node.childNodes.map(AstNodeToReact);
    return React.createElement(Section, attr, children);
  }

  if (node.nodeName === 'h1') {
    attr.type = nodeClass;
    const children = node.childNodes.map(AstNodeToReact);
    return React.createElement(Heading1, attr, children);
  }

  if (node.nodeName === 'h2') {
    attr.type = nodeClass;
    const children = node.childNodes.map(AstNodeToReact);
    return React.createElement(Heading2, attr, children);
  }

  if (node.nodeName === 'ul' && nodeClass === 'task-list') {
    const children = node.childNodes.map(AstNodeToReact);
    return React.createElement(TaskList, attr, children);
  }

  //////////////////////

  const children = node.childNodes.map(AstNodeToReact);
  return React.createElement(node.tagName, attr, children);
};

const htmlToReact = (html) => {
  let htmlAST = parse5.parseFragment(html);

  if (htmlAST.childNodes.length === 0) {
    return null;
  }

  const result = htmlAST.childNodes.map(AstNodeToReact);

  return result.length === 1 ? result[0] : result;
};

export default htmlToReact;
