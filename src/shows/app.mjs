/**
 * Show function - use multiple `provides()` for media type-based content
 * negotiation.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#showfun
 *
 * @param {object} doc - Processed document, may be omitted.
 * @param {object} req - Request Object. http://docs.couchdb.org/en/latest/json-structure.html#request-object
 *
 * @returns {object} Response Object. http://docs.couchdb.org/en/latest/json-structure.html#response-object
 **/
import "../polyfills"
import Hello from "../components/App.svelte"
import page from "../page"
import { search } from "../jmespath"

const name = search({ foo: { bar: 'jaye' } }, 'foo.bar')

export default (doc, req) => {
    provides('html', () => {
        const { html, css, head } = Hello.render({
            name: req.query.name || "world"
        });
        return page(head, css.code, html, `<script>doc = ${doc}</script>`)
    });
}