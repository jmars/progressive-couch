import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import prepack from './prepack-plugin'
import { terser } from 'rollup-plugin-terser'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import fs from 'fs'
import csso from 'csso'

const shows = fs.readdirSync('./src/shows/server').filter(name => name.includes(".mjs"))

const production = true

const couchPlugins = [
	svelte({
		generate: 'ssr',
		hydratable: true,
		dev: false,
		css: css => {
			//css.write('_attachments/bundle.css', false);
		}
	}),
	resolve(),
	buble(),
	prepack({
		couch: true
	}),
	terser()
]

const couchModules = shows.map(name => ({
	input: [`src/shows/server/${name}`],
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
			const optimized = csso.minify(css.code).css
			css.code = optimized
			css.write('_attachments/bundle.css', false)
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
		input: ['src/init.mjs'],
		output: {
			format: 'iife',
			name: 'init',
			file: '_attachments/init.js'
		},
		plugins
	},
	{
		input: ['src/app.mjs'],
		output: {
			format: 'system',
			dir: '_attachments'
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
	{
		input: shows.map(name => `src/shows/client/${name.replace('mjs', 'svelte')}`),
		output: {
			format: 'system',
			dir: '_attachments'
		},
		plugins
	},
	...couchModules
]