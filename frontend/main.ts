import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import * as md from "../pkg/md_to_html"

console.log(md.md_to_html("## test"))
createApp(App).mount('#app')
