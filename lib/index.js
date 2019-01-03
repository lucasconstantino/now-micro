const FileBlob = require('@now/build-utils/file-blob')
const { build: nodeBuild, prepareCache, config } = require('@now/node')

module.exports.prepareCache = prepareCache
module.exports.config = config

module.exports.build = async (context, ...args) => {
  const { entrypoint } = context

  const stream = context.files[entrypoint].toStream()
  const { data } = await FileBlob.fromStream({ stream })

  const content = `
    ${data.toString()}

    const { run: __micro_run } = require('micro')

    let __original_lambda = typeof exports === 'function' ? exports : module.exports

    if (typeof __original_lambda !== 'function') {
      throw new Error(
        \`now-micro expect maind export to be a function (\${ typeof __original_lambda } given)\`,
      )
    }

    exports = module.exports = (req, res) => __micro_run(req, res, __original_lambda)
  `

  const result = new FileBlob({ data: content })

  // override entrypoint file
  context.files[entrypoint] = result

  return nodeBuild(context, ...args)
}
