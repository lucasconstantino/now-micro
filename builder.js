const { ensureDirSync, writeFileSync } = require('fs-extra')
const { basename, dirname, join: pathJoin } = require('path')
const FileBlob = require('@now/build-utils/file-blob')
const FileFsRef = require('@now/build-utils/file-fs-ref')
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
  const { entrypoint, workPath } = context

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
  const fileDir = pathJoin(workPath, dirname(entrypoint).replace(__dirname, ''))
  const filePath = pathJoin(fileDir, basename(entrypoint))
  await ensureDirSync(fileDir, { recursive: true })
  await writeFileSync(filePath, content)

  // override entrypoint file
  context.files[entrypoint] = new FileFsRef({ fsPath: filePath })

  // delegate to @now/node the rest of the building process
  return nodeBuild(context, ...args)
}
