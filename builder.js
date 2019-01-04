const FileBlob = require('@now/build-utils/file-blob')
const { build: nodeBuild, prepareCache, config } = require('@now/node')

// re-export equivalent assets
module.exports.config = config
module.exports.prepareCache = prepareCache

/**
 * Now.sh builder for micro-compatible lambdas.
 *
 * @TODO: should ensure package.json contains micro dependency.
 */
module.exports.build = async (context, ...args) => {
  const { entrypoint } = context

  const stream = context.files[entrypoint].toStream()
  const { data } = await FileBlob.fromStream({ stream })

  const content = `${data.toString()}
    let __original_lambda

    if (typeof exports === 'function') {
      __original_lambda = exports
    }
    else if (typeof module.exports === 'function') {
      __original_lambda = module.exports
    }
    else {
      throw new Error(
        \`now-micro builder expects main export to be a function (\${typeof module.exports} found)\`,
      )
    }

    exports = module.exports = (req, res) => require('micro').run(req, res, __original_lambda)
  `

  const result = new FileBlob({ data: content })

  // override entrypoint file
  context.files[entrypoint] = result

  // delegate to @now/node the rest of the building process
  return nodeBuild(context, ...args)
}
