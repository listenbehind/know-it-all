/* eslint-disable max-len */
import fs from 'fs';
import path from 'path';
import { h } from 'preact'; /** @jsx h */
import preactRenderToString from 'preact-render-to-string';

import App from '../components/App/App.jsx';
import {
  WEBPACK_BUNDLE,
} from '../constants.js';

const data = require(`../data/data.json`);

export default ({ dataFileName = `data.json`, scriptFileName, mode }) => {
  let scriptSrc;
  let styleTag = ``;

  if (mode === `production`) {
    scriptSrc = scriptFileName;

    const stylesPath = path.resolve(__dirname, `../../public/styles.css`);
    const styles = fs.readFileSync(stylesPath, `utf8`);

    styleTag = `<style>${styles}</style>`;
  } else {
    scriptSrc = `http://localhost:8081/${WEBPACK_BUNDLE}`;
  }

  const appHtml = preactRenderToString(<App data={data} />);

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf8">
      <title>Know it all</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <link rel="manifest" href="manifest.json">
      
      <meta name="theme-color" content="#bf360c">
      <meta name="description" content="A big list of all the props, values, methods, functions, interfaces, modules, constants, constructors, events, attributes, parameters, return values, variables, elements, statements, operators, declarations, types, primatives, selectors and units of all the APIs related to web development.">
      
      ${styleTag}
      
      <link rel="prefetch" href="${dataFileName}" />
      
      <script>
        window.APP_DATA = {
          dataFileName: '${dataFileName}',
          version: '${process.env.npm_package_version}',
        };
        
        (function() {
          var scriptSrc = '${scriptSrc}';
  
          var newBrowser = (
            'fetch' in window &&
            'Promise' in window &&
            'assign' in Object &&
            'keys' in Object
          );
  
          if (!newBrowser) {
            scriptSrc = scriptSrc.replace('app.', 'app-with-polyfills.');
            console.log('This is not a great browser, loading package with polyfills.');
          }
  
          var scriptEl = document.createElement('script');
          scriptEl.src = scriptSrc;
          scriptEl.async = true;
  
          var firstScript = document.getElementsByTagName('script')[0];
          firstScript.parentNode.insertBefore(scriptEl, firstScript);
        })();
      </script>
    </head>
    <body>${appHtml}</body>
  </html>
  `;
};

/* eslint-enable max-len */
