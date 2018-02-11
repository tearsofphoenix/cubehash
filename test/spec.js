import assert from 'assert'
import CubeHash from '../index'

console.log(CubeHash)

describe('cubehash test', () => {
  const names = [128, 192, 256, 384, 512]

  it('should ok', () => {
    // http://cubehash.cr.yp.to
    // http://en.wikipedia.org/wiki/CubeHash
    const tests = ['Hello'
      // , 'Hello', 'The quick brown fox jumps over the lazy dog'
    ];

    for (let i = 0; i < tests.length; i++) {
      const buffer = Buffer.from(tests[i], 'utf8')
      console.log(`for ------------------${buffer}-----------------------`)
      const result = CubeHash(512, buffer)
      console.log(512, Buffer.from(result).toString('hex'), result.length)
      // names.forEach(nLooper => {
      //   const result = CubeHash(nLooper, buffer)
      //   console.log(nLooper, Buffer.from(result).toString('hex'), result.length)
      // })
    }
  })
})
