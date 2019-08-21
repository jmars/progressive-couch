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
import page from "../page"

export default function (Component) {
  return (doc, req, ...args) => {
    const p = this.provides ? (...args) => this.provides(...args) : provides
    p('html', () => {
        const { html, css, head } = Component.render({
            doc,
            ssr: true,
            query: req.query
        });
        return page(head, html)
    });
    p('json', () => {
        return {
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON.stringify(doc)
        }
    })
  }
}