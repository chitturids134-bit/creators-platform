// src/setupTests.js
import { TextEncoder, TextDecoder } from 'node:util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;