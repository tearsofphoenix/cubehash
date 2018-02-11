"use strict";

var CubeHashModule = require('./cubehash');
var CM = CubeHashModule({});
var hashFunc = CM.cwrap('cubehash', 'number', ['number', 'number', 'number', 'number'])
/**
 *
 * @param hashBitLength {Number}
 * @param buffer {Buffer|Uint8Array}
 */
function hash(hashBitLength, buffer) {

  const iptr = CM._malloc(buffer.length)
  const i = new Uint8Array(CM.HEAPU8.buffer, iptr, buffer.length)
  i.set(buffer)

  const outptr = CM._malloc(hashBitLength / 8)
  const ret = hashFunc(hashBitLength, iptr, buffer.length * 8, outptr)
  console.log(19, ret)
  return new Uint8Array(new Uint8Array(CM.HEAPU8.buffer, outptr, hashBitLength / 8))
}

export default hash
