
import React, { KeyboardEvent, KeyboardEventHandler, useState } from 'react';
import { Button, Tab, Tabs } from 'react-bootstrap';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { html } from '@codemirror/lang-html';
import { languages } from '@codemirror/language-data';

import * as md from "../pkg/md_to_html"
import './App.css'

export function App(){
  const [store, setStore] = useState({
    markdown: "## Name",
    htmlResult: "",
    convertDurationInMs: -1,
  })

  const updateMarkdown = React.useCallback((value: string) => {
    setStore({...store, markdown: value});
  }, [store]);

  const convert = () => {
    const start = Date.now();
    const html = md.md_to_html(store.markdown)
    const duration = Date.now() - start;
    setStore({...store, htmlResult: html, convertDurationInMs: duration});
  }
  
  const onKeyDown: KeyboardEventHandler = (event: KeyboardEvent<Element>) => {
    if ((event.metaKey || event.ctrlKey) && event.key == 'Enter'){
      convert();
    }
  }
  
  return (
    <div>
      <h1>Html Converter</h1>
      <div>
        Using wasm version of <a href="https://github.com/raphlinus/pulldown-cmark">pulldown cmark</a> packed with <a href="https://github.com/rustwasm/wasm-pack">wasm-pack</a>
      </div>

      <div className="main h-100 mt-3" onKeyDown={onKeyDown}>
        <div className='col-6'>
          <Button variant="primary" className="mb-2" onClick={convert}>Convert</Button>

          <CodeMirror
            className='md-textarea border'
            // height="600px"
            theme="dark"
            value={store.markdown}
            onChange={updateMarkdown}
            extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
          />
        </div>
        
        <div className='col-6'>
          <Tabs defaultActiveKey="Html">
            <Tab eventKey="Html" title="Html">
              <CodeMirror
                className='md-html border'
                // height="600px"
                theme="dark"
                value={store.htmlResult}
                extensions={[html()]}
              />
            </Tab>
            <Tab eventKey="Preview" title="Preview">
              <div className="border preview" dangerouslySetInnerHTML={{__html: store.htmlResult}} ></div>
            </Tab>
          </Tabs>
        </div>
      </div>

      <div>
        {store.convertDurationInMs >= 0 && <span>Converted in {store.convertDurationInMs} milliseconds</span>}
      </div>
    </div>
  )
}
