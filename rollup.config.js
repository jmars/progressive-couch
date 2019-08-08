import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import prepack from './prepack-plugin'
import { terser } from 'rollup-plugin-terser'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import fs from 'fs'

const shows = fs.readdirSync('./src/shows').filter(name => name.includes(".mjs"))

const production = true

const couchPlugins = [
	svelte({
		generate: 'ssr',
		hydratable: true,
		dev: false,
		css: css => {
			css.write('_attachments/bundle.css', false);
		}
	}),
	resolve(),
	buble(),
	prepack({
		couch: true
	}),
	//terser()
]

const couchModules = shows.map(name => ({
	input: [`src/shows/${name}`],
	output: {
		format: 'iife',
		file: `shows/${name.replace('.mjs', '.js')}`,
		strict: false,
		name: name.replace('.mjs', '')
	},
	plugins: couchPlugins
}))

const plugins = [
	svelte({
		hydratable: true,
		dev: false,
		css: css => {
			css.write('_attachments/bundle.css', false);
		}
	}),
	builtins(),
	resolve({
		browser: true,
		dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
	}),
	commonjs(),
	globals(),
	buble(),
	terser()
]

export default [
	{
		input: ['src/app.mjs'],
		output: {
			format: 'iife',
			name: 'app',
			file: '_attachments/bundle.js'
		},
		plugins
	},
	{
		input: ['src/sw.mjs'],
		output: {
			format: 'iife',
			name: 'sw',
			file: '_attachments/sw.js'
		},
		plugins
	},
	...couchModules
]