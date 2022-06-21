'use strict';
(async () => {
  const { readFile } = require('fs/promises')
  const { merge } = require('lodash')

  const data = await readFile('./test.json', 'utf8')
  const split = data.split('\n')
  const output = split
  .map(JSON.parse)
  .reduce((acc, v) => merge(acc, v), {})
  console.log(JSON.stringify(output))
})()
