
import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
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
  })

  const updateMarkdown = React.useCallback((value: string) => {
    setStore({...store, markdown: value});
  }, []);

  const convert = () => {
    setStore({...store, htmlResult: md.md_to_html(store.markdown)});
  }
  
  return (
    <>
      <h1>Html Converter</h1>

      <div className="main h-100">
        <div className='col-5'>
          <CodeMirror
            className='md-textarea'
            value={store.markdown}
            onChange={updateMarkdown}
            extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
          />
        </div>

        <button type="button" onClick={convert}>Convert</button>
        
        <div className='col-5'>
          <Tabs defaultActiveKey="Html">
            <Tab eventKey="Html" title="Html">
              <CodeMirror
                className='md-html'
                value={store.htmlResult}
                extensions={[html()]}
              />
            </Tab>
            <Tab eventKey="Preview" title="Preview">
              <div dangerouslySetInnerHTML={{__html: store.htmlResult}} ></div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  )
}
