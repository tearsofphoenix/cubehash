const CUBEHASH_ROUNDS = 16
const CUBEHASH_BLOCKBYTES = 32

export function ROTATE(a,b) {
  return (((a) << (b)) | ((a) >>> (32 - b)))
}

export function transform(state)
{
  let i;
  let r;
  const y = new Uint32Array(16);

  for (r = 0;r < CUBEHASH_ROUNDS;++r) {
    for (i = 0;i < 16;++i) state.x[i + 16] += state.x[i];
    for (i = 0;i < 16;++i) y[i ^ 8] = state.x[i];
    for (i = 0;i < 16;++i) state.x[i] = ROTATE(y[i],7);
    for (i = 0;i < 16;++i) state.x[i] ^= state.x[i + 16];
    for (i = 0;i < 16;++i) y[i ^ 2] = state.x[i + 16];
    for (i = 0;i < 16;++i) state.x[i + 16] = y[i];
    for (i = 0;i < 16;++i) state.x[i + 16] += state.x[i];
    for (i = 0;i < 16;++i) y[i ^ 4] = state.x[i];
    for (i = 0;i < 16;++i) state.x[i] = ROTATE(y[i],11);
    for (i = 0;i < 16;++i) state.x[i] ^= state.x[i + 16];
    for (i = 0;i < 16;++i) y[i ^ 1] = state.x[i + 16];
    for (i = 0;i < 16;++i) state.x[i + 16] = y[i];
  }
}

function init(state, hashbitlen)
{
  let i;
  let j;
  if (hashbitlen < 8) return null;
  if (hashbitlen > 512) return null;
  if (hashbitlen != 8 * (hashbitlen / 8)) return null;

  state.hashbitlen = hashbitlen;
  for (i = 0;i < 32;++i) state.x[i] = 0;
  state.x[0] = hashbitlen / 8;
  state.x[1] = CUBEHASH_BLOCKBYTES;
  state.x[2] = CUBEHASH_ROUNDS;
  // apply initial 16 rounds
  transform(state);
  state.pos = 0;
  return state;
}

function update(state, data)
{
  /* caller promises us that previous data had integral number of bytes */
  /* so state.pos is a multiple of 8 */
  let databitlen = data.length * 8
  let idx = 0
  while (databitlen >= 8) {
    let u = data[idx];
    u <<= 8 * (Math.floor(state.pos / 8) % 4);
    let j = Math.floor(state.pos / 32)
    const val = state.x[j]
    state.x[j] = val ^ u
    idx += 1;
    databitlen -= 8;
    state.pos += 8;
    if (state.pos == 8 * CUBEHASH_BLOCKBYTES) {
      transform(state);
      state.pos = 0;
    }
  }
  if (databitlen > 0) {
    let u = data[idx];
    u <<= 8 * (Math.floor(state.pos / 8) % 4);
    state.x[Math.floor(state.pos / 32)] ^= u;
    state.pos += databitlen;
  }
}

/**
 *
 * @param state
 * @returns {Uint8Array}
 */
function final(state)
{
  let i;
  let u;

  u = (128 >>> (state.pos % 8));
  u <<= 8 * (Math.floor(state.pos / 8) % 4);
  state.x[Math.floor(state.pos / 32)] ^= u;
  transform(state);
  state.x[31] ^= 1;
  // apply final 32 rounds
  transform(state);
  transform(state);
  let hashval = new Uint8Array(state.hashbitlen / 8)
  for (i = 0;i < state.hashbitlen / 8;++i) hashval[i] = state.x[Math.floor(i / 4)] >>> (8 * (i % 4));
  return hashval
}

/**
 * @param hashbitlen {Number}
 * @param data {Buffer|Uint8Array}
 * @returns {Uint8Array}
 */
export default function(hashbitlen, data) {
  let state = {
    x: new Uint32Array(32)
  }
  init(state, hashbitlen)
  if (!state) return null;
  update(state, data)
  return final(state)
}
