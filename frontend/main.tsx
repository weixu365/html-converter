import React from 'react';
import { createRoot } from 'react-dom/client';

import {App} from './App'

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './style.css'

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
