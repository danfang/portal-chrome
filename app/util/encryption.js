import crypto from 'sjcl';

const ENCRYPT_KEY_BITS = 256;
const ENCRYPT_IV_BITS = 128;

const CRYPTO_SETTINGS = { ks: ENCRYPT_KEY_BITS, ts: ENCRYPT_IV_BITS };

export function encrypt(bits, message) {
  const obj = JSON.parse(crypto.encrypt(bits, message, CRYPTO_SETTINGS));
  const iv = crypto.codec.base64.toBits(obj.iv);
  const ct = crypto.codec.base64.toBits(obj.ct);
  const res = iv.concat(ct);
  return crypto.codec.base64.fromBits(res);
}

export function decrypt(bits, encrypted) {
  const total = crypto.codec.base64.toBits(encrypted);
  const iv = crypto.codec.base64.fromBits(crypto.bitArray.bitSlice(total, 0, ENCRYPT_IV_BITS));
  const ct = crypto.codec.base64.fromBits(crypto.bitArray.bitSlice(total, ENCRYPT_IV_BITS));
  const obj = JSON.stringify({ ...CRYPTO_SETTINGS, iv, ct });
  return crypto.decrypt(bits, obj);
}
