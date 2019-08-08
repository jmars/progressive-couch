import prepack from "prepack"

export default function prepackPlugin (rOptions) {
  return {
    name: 'prepack',
    renderChunk(source, chunk, options) {
      try {
        const { code } = prepack.prepackSources([
          {
            fileContents: source,
            filePath: chunk.fileName
          }
        ], rOptions)
        if (rOptions && rOptions.couch) {
          return { code:
            code
            .replace(`_$0.${chunk.name} =`, 'return')
            .replace(`var ${chunk.name};`, '')
            .replace('_$0 = this', '_$0 = this || globalThis')
          }
        }
        return { code }
      } catch (err) {
        throw err
      }
    }
  }
}