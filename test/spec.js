import assert from 'assert'
import CubeHash, { ROTATE, transform } from '..'

console.log(CubeHash)

describe('cubehash test', () => {
  const names = [128, 192, 256, 384, 512]

  it('should ROTATE', function () {
    assert.equal(ROTATE(0, 7), 0)
    assert.equal(ROTATE(64, 7), 8192)
    assert.equal(ROTATE(32, 11), 65536)
    assert.equal(ROTATE(16, 11), 32768)
    assert.equal(ROTATE(268961216, 11), 1076756608)
    assert.equal(ROTATE(135005120, 11), 1612578880)
    assert.equal(ROTATE(69993152, 11), 1612054561)
  });

  it('should transform', function () {
    const state = {
      x: new Uint32Array([64, 32, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
    transform(state)
    assert.deepEqual(state.x, new Uint32Array([2015330639, 418666790, 2569762080, 3357769207, 3840129672, 2063627775,
      1368484226, 2491179335, 2646634250, 1293516469, 3068228132, 2435717834, 1383134689, 3656372460, 4043110344,
      550766415, 357859310, 4102263571, 24909980, 2937860906, 3729620108, 2224652012, 1540913731, 3067334741, 987908016,
      730640550, 3654732341, 1274096532, 2549299793, 1660650669, 2121328147, 1376546971]))
  });
  it('should cubehash512', () => {
    // http://cubehash.cr.yp.to
    // http://en.wikipedia.org/wiki/CubeHash
    const tests = ['Hello',
      'The quick brown fox jumps over the lazy dog'
    ];
    const hashes = [
        'a3c2b3d38c940b46b51c286b0159bceb34fa7ae4d307234f48a2ca4662a21ddc5875fda2c2a5994bb4d45dbbb3218381174d5dd5f0aae87db87d086dff46e3ae',
      'a9ba7b8c6b4ecc6660bb3b35f076db7fce4930296491922744c67ef08dc1217ce5eb26bb25247e3bc8904b46d468455e6807c21410c1fb95e44824dc7d57c7ff'
    ]

    for (let i = 0; i < tests.length; i++) {
      const buffer = Buffer.from(tests[i], 'utf8')
      const result = CubeHash(512, buffer)
      assert.equal(Buffer.from(result).toString('hex'), hashes[i])
    }
  })
})
