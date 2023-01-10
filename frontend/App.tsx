
import React, { ChangeEvent, KeyboardEvent, KeyboardEventHandler, useEffect, useRef, useState } from 'react';

import { marked } from 'marked';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { html } from '@codemirror/lang-html';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import * as Prism from 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/autoloader/prism-autoloader';

import * as md from "../pkg/md_to_html"
import { CheatSheet } from './CheatSheet';

import "prismjs/themes/prism-tomorrow.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";
import './App.css'

export function App(){
  const [store, setStore] = useState({
    library: "pulldown-cmark",
    htmlResult: "",
    convertDurationInMs: -1,
  })

  const changed = useRef(true)
  const markdownContent = useRef("## Name")
  const intermediateHtmlContentRef = useRef<HTMLDivElement>(null)
  const highlightedHtmlContentRef = useRef<HTMLDivElement>(null)

  const updateMarkdown = React.useCallback((value: string) => {
    markdownContent.current = value;
    changed.current = true;
  }, [store]);

  useEffect(() => {
    setInterval(() => {
      if(changed.current) {
        changed.current = false;
        convert();
      }
    }, 500);  
  })
  
  const changeLibrary = React.useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setStore({...store, library: e.target.value, convertDurationInMs: -1});
  }, [store]);

  const convert = () => {
    const toHtml = store.library === 'pulldown-cmark' ? md.md_to_html : marked.parse;
    const start = Date.now();
    const html = toHtml(markdownContent.current)
    const duration = Date.now() - start;

    setStore({...store, htmlResult: html, convertDurationInMs: duration});
    setTimeout(() => {
      Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/';
      Prism.plugins.autoloader.use_minified = true;
      Prism.highlightAll();
      
      highlightedHtmlContentRef.current!.innerHTML = intermediateHtmlContentRef.current!.innerHTML;
    }, 200);
  }
  
  const onKeyDown: KeyboardEventHandler = (event: KeyboardEvent<Element>) => {
    if ((event.metaKey || event.ctrlKey) && event.key == 'Enter'){
      convert();
      event.preventDefault();
    }
  }
  
  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex border-bottom pb-2 header">
        <h1 className="mb-0">Html Converter</h1>

        <div className="flex-grow-1 ms-3 align-self-end">
          Using the wasm version of <a href="https://github.com/raphlinus/pulldown-cmark">pulldown cmark</a> packed
          with <a href="https://github.com/rustwasm/wasm-pack">wasm-pack</a>
        </div>

        <div className="links align-self-end">
          <a href="https://github.com/weixu365/html-converter"><i className="bi bi-github"></i></a>
        </div>
      </div>

      <div className="main container-fluid flex-grow-1 mt-3" onKeyDown={onKeyDown}>
        <div className="row g-2 h-100">
          <div className="col-12 col-lg-6 d-flex flex-column">
            <div>
              <Form.Select className="select-library" defaultValue={store.library} onChange={changeLibrary}>
                <option value="pulldown-cmark">pulldown-cmark (Rust)</option>
                <option value="marked">marked (Nodejs)</option>
              </Form.Select>

              <Button variant="primary" className="mb-1 ms-2" onClick={convert}>Convert</Button>
            </div>

            <CodeMirror
              className="md-textarea border flex-grow-1"
              theme="dark"
              value={markdownContent.current}
              onChange={updateMarkdown}
              onKeyDown={onKeyDown}
              extensions={[markdown({ base: markdownLanguage, codeLanguages: languages }), EditorView.lineWrapping]}
            />
          </div>
          
          <div className="col-12 col-lg-6 d-flex flex-column html-result">
            <Tabs defaultActiveKey="Html">
              <Tab eventKey="Html" title="Html">
                <CodeMirror
                  className="md-html border"
                  theme="dark"
                  value={store.htmlResult}
                  extensions={[html(), EditorView.lineWrapping]}
                />
              </Tab>
              <Tab eventKey="Preview" title="Preview">
                <div ref={highlightedHtmlContentRef} className="border preview line-numbers p-1"></div>
                <div ref={intermediateHtmlContentRef} className="d-none line-numbers" dangerouslySetInnerHTML={{__html: store.htmlResult}} ></div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="duration">
        {store.convertDurationInMs >= 0 && <span>Converted in {store.convertDurationInMs} milliseconds using {store.library}</span>}
      </div>

      <CheatSheet />
    </div>
  )
}
