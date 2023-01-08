
import React, { ChangeEvent, KeyboardEvent, KeyboardEventHandler, useState } from 'react';
import * as Prism from 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/autoloader/prism-autoloader';

import "prismjs/themes/prism-tomorrow.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";

import { marked } from 'marked';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { html } from '@codemirror/lang-html';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';

import * as md from "../pkg/md_to_html"
import './App.css'
import { CheatSheet } from './CheatSheet';

export function App(){
  const [store, setStore] = useState({
    library: "pulldown-cmark",
    markdown: "## Name",
    htmlResult: "",
    convertDurationInMs: -1,
  })

  const updateMarkdown = React.useCallback((value: string) => {
    setStore({...store, markdown: value});
  }, [store]);

  const changeLibrary = React.useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setStore({...store, library: e.target.value, convertDurationInMs: -1});
  }, [store]);

  const convert = () => {
    const toHtml = store.library === 'pulldown-cmark' ? md.md_to_html : marked.parse;

    const start = Date.now();
    const html = toHtml(store.markdown)
    const duration = Date.now() - start;

    setStore({...store, htmlResult: html, convertDurationInMs: duration});
    setTimeout(() => {
      Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/';
      Prism.plugins.autoloader.use_minified = true;
      Prism.highlightAll()
    }, 200);
  }
  
  const onKeyDown: KeyboardEventHandler = (event: KeyboardEvent<Element>) => {
    if ((event.metaKey || event.ctrlKey) && event.key == 'Enter'){
      convert();
      event.preventDefault();
    }
  }
  
  return (
    <div>
      <div className="position-relative">
        <h1>Html Converter</h1>

        <span className="links position-absolute top-0 end-0 m-2">
          <a href="https://github.com/weixu365/html-converter"><i className="bi bi-github"></i></a>
        </span>
      </div>
      <div>
        Using the wasm version of <a href="https://github.com/raphlinus/pulldown-cmark">pulldown cmark</a> packed
        with <a href="https://github.com/rustwasm/wasm-pack">wasm-pack</a>
      </div>

      <div className="main h-100 mt-3" onKeyDown={onKeyDown}>
        <div className='pe-2 col-12 col-md-6'>
          <Form.Select className="select-library" aria-label="Change library for convertion" defaultValue={store.library} onChange={changeLibrary}>
            <option value="pulldown-cmark">pulldown-cmark (Rust)</option>
            <option value="marked">marked (Nodejs)</option>
          </Form.Select>

          <Button variant="primary" className="mb-2 ms-2" onClick={convert}>Convert</Button>

          <CodeMirror
            className='md-textarea border'
            // height="600px"
            theme="dark"
            value={store.markdown}
            onChange={updateMarkdown}
            onKeyDown={onKeyDown}
            extensions={[markdown({ base: markdownLanguage, codeLanguages: languages }), EditorView.lineWrapping]}
          />
        </div>
        
        <div className='ps-2 col-12 col-md-6'>
          <Tabs defaultActiveKey="Html">
            <Tab eventKey="Html" title="Html">
              <CodeMirror
                className='md-html border'
                // height="600px"
                theme="dark"
                value={store.htmlResult}
                extensions={[html(), EditorView.lineWrapping]}
              />
            </Tab>
            <Tab eventKey="Preview" title="Preview">
              <div className="border preview line-numbers p-1" dangerouslySetInnerHTML={{__html: store.htmlResult}} ></div>
            </Tab>
          </Tabs>
        </div>
      </div>

      <div className="duration">
        {store.convertDurationInMs >= 0 && <span>Converted in {store.convertDurationInMs} milliseconds using {store.library}</span>}
      </div>

      <CheatSheet />
    </div>
  )
}
