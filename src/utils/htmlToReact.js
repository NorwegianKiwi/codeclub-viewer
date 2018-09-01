// Inspired by https://github.com/utatti/react-render-html/blob/master/index.js
import React from 'react';
import convertAttr from 'react-attr-converter';
import htmlParser from 'parse5';
import styleParser from './styleParser';
import ToggleButton from '../components/LessonPage/ToggleButton';

/*
The parse5.parseFragment() returns the following tree:
{
  nodeName: '#document-fragment',
  childNodes: [
    {
      nodeName: 'h1',
      tagName: 'h1',
      attrs: [
        {name: 'class', value: 'myClass'},
        ...
      ],
      namespaceURI: 'http://www.w3.org/1999/xhtml',
      childNodes: [
        {...},
        ...
      ],
      parentNode: {nodeName: '#document-fragment', childNodes: [ ... ]},
    },
    {
      nodeName: '#text',
      value: 'Any text or perhaps a line shift',
      parentNode: {nodeName: '#document-fragment', childNodes: [ ... ]},
    },
    ...
  ]
}
 */
const getClass = (attrs) => {
  for (let attr of attrs) {
    if (attr.name === 'class') {
      return attr.value;
    }
  }
};

const setClass = (attrs, value) => {
  for (let attr of attrs) { // Loop through and check if there already exist an attribute "class"
    if (attr.name === 'class') {
      attr.value = [attr.value, value].join(' ').trim(); // Add value to existing
      return;
    }
  }
  attrs.push({name: 'class', value}); // If attribute "class" didn't exist, create it
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

const renderScratchBlocks = (node) => {
  const isPre = node.nodeName === 'pre' && getClass(node.attrs) === 'blocks';
  const isCode = node.nodeName === 'code' && getClass(node.attrs) === 'b';
  if (isPre || isCode) {
    const scratchblocks = require('scratchblocks/browser/scratchblocks.js');
    const scratchCode = node.childNodes.filter(child => child.nodeName === '#text')[0].value;
    const SVG = scratchblocks(scratchCode, {inline: isCode});
    const parsedSVG = htmlParser.parseFragment(SVG).childNodes[0];
    // To switch out the current node, we have to go via the parentNode:
    const siblings = node.parentNode.childNodes;
    for (let idx = 0; idx < siblings.length; ++idx) {
      if (siblings[idx] === node) {
        siblings[idx] = parsedSVG;
        return;
      }
    }
  }
};

const createModifyStyles = (styles) => (node) => {
  node.attrs.forEach(attr => {
    if (attr.name === 'class' && attr.value in styles) {
      attr.value = styles[attr.value];
    }
  });
};

const headerIcons = {
  'check': require('assets/graphics/check.svg'),
  'flag': require('assets/graphics/flag.svg'),
  'save': require('assets/graphics/save.svg'),
};
const insertHeaderIcons = (node) => {
  if (node.tagName === 'h2') {
    const className = getClass(node.attrs);
    if (Object.keys(headerIcons).includes(className)) {
      const imgNode = {
        nodeName: 'img',
        tagName: 'img',
        attrs: [
          {name: 'src', value: headerIcons[className]},
          {name: 'alt', value: className},
        ],
        namespaceURI: 'http://www.w3.org/1999/xhtml',
        childNodes: [],
        parentNode: node,
      };
      node.childNodes.unshift(imgNode);
    }
  }
};

const walkTree = (node, modifiers) => {
  const skipNodeNames = ['#text', '#comment', 'svg'];
  if (!skipNodeNames.includes(node.nodeName)) {
    node.childNodes.forEach(node => walkTree(node, modifiers));
    modifiers.forEach(modifier => modifier(node));
  }
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

  // Extra replacements:
  if (node.nodeName === 'toggle') {
    const strongNode = getFirstChildWithTagname(node, 'strong');
    attr.buttonText = strongNode ? getTextContent(strongNode) : 'Hint';
    const hiddenNode = getFirstChildWithTagname(node, 'hide');
    attr.hiddenHTML = hiddenNode ? htmlParser.serialize(hiddenNode) : '';
    return React.createElement(ToggleButton, attr);
  }
  //////////////////////

  const children = node.childNodes.map(AstNodeToReact);
  return React.createElement(node.tagName, attr, children);
};

const htmlToReact = (html, styles, isHydrated) => {
  let htmlAST = htmlParser.parseFragment(html);

  if (htmlAST.childNodes.length === 0) {
    return null;
  }

  //////////////////
  // Modify AST tree
  const modifiers = [];
  if (typeof document !== 'undefined' && isHydrated) {
    modifiers.push(renderScratchBlocks);
  }
  modifiers.push(insertHeaderIcons);
  modifiers.push(createModifyStyles(styles)); // This one should come last

  htmlAST.childNodes.forEach(node => walkTree(node, modifiers));
  // if (typeof document !== 'undefined') {
  //   console.log('modified AST-tree:', htmlAST);
  //   console.log('html:', htmlParser.serialize(htmlAST));
  // }

  //////////////////

  const result = htmlAST.childNodes.map(AstNodeToReact);

  return result.length === 1 ? result[0] : result;
};

export default htmlToReact;
