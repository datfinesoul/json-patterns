'use strict'
/*
 * orderedJsonStringify is used to sort the keys in a nested
 * multi level object.
 *
 * With a large amount of data, this method has the potential
 * be extremly CPU intensive, but since in our case we are using
 * it on subset of the original data, it might be okay.
 *
 * An alternative could be jq:
 * <output.json jq -Sc . | sort | uniq | jq . > sorted.json
 */
const orderedJsonStringify = (obj, indent) => {
  const allKeys = new Set()
  // Unlike Object.keys, this goes recursive
  JSON.stringify(obj, (key, value) => {
    allKeys.add(key)
    return value
  })
  const keys = [...allKeys]
  keys.sort()
  return JSON.stringify(obj, keys, indent)
}

/*
 * Takes a set with JSON strings, sorts them, and returns the reduced set
 */
const reduceSet = (patterns, indent = 0) => {
  const final = new Set()
  Array.from(patterns).forEach(v => {
    final.add(orderedJsonStringify(JSON.parse(v), indent))
  })
  return [...final]
}

/*
 * Checks if the maximum time we want to wait on the stream before closing it.
 * Then writes the output to a file
 */
const checker = function (ctx) {
  const { writeFile } = require('fs/promises')
  const method = function () {
    process.stderr.write('.')
    if ((Date.now() - ctx.lastDone) > ctx.maxWaitMs) {
      ctx.stream.close()
      clearInterval(this)
      writeFile('./output.json', reduceSet(ctx.patterns, ctx.indent).join('\n'), 'utf8')
      process.stderr.write('\n')
    }
  }
  method.bind(this)
  return method
}

const oboe = require('oboe')
const { createReadStream } = require('fs')
const ctx = {
  maxWaitMs: 1000,
  indent: 0,
  lastDone: Date.now(),
  patterns: new Set(),
  stream: createReadStream('./examples/sample.input')
}

oboe(ctx.stream)
.node('*', obj => {
  // skip objects and keep recursing into them
  if (typeof (obj) !== 'object') {
    // standardize all leaf node values
    switch (typeof (obj)) {
      case 'string':
        return ''
      case 'number':
        return 0
      default:
        throw new Error(`${typeof (obj)} conversion missing`)
    }
  }
})
.fail(error => {
  console.error(error)
  throw new Error('unhandled type')
})
.done(item => {
  ctx.lastDone = Date.now()
  ctx.patterns.add(JSON.stringify(item, null, 0))
})

//const interval = setInterval(checker(ctx), ctx.maxWaitMs)
setInterval(checker(ctx), ctx.maxWaitMs)
