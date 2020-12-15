import { createRequire } from 'https://deno.land/std@0.81.0/node/module.ts'

// loading npm_modules
const require = createRequire(import.meta.url)
const express = require('express')

// deno run --allow-read --unstable
