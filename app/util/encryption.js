import CryptoJS from "crypto-js";

const ENCRYPT_IV_BITS = 128;

export function encrypt(encryptionKey, input) {
  const iv = CryptoJS.lib.WordArray.random(ENCRYPT_IV_BITS / 8);
  const key = CryptoJS.enc.Hex.parse(encryptionKey);
  const ct = CryptoJS.AES.encrypt(input, key, { iv }).ciphertext;
  return iv.concat(ct).toString(CryptoJS.enc.Base64);
}

export function decrypt(encryptionKey, input) {
  const key = CryptoJS.enc.Hex.parse(encryptionKey);
  const total = CryptoJS.enc.Base64.parse(input).words;
  const iv = CryptoJS.lib.WordArray.create(total.slice(0, ENCRYPT_IV_BITS / 32));
  const ct = CryptoJS.lib.WordArray.create(total.slice(ENCRYPT_IV_BITS / 32));;
  return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt({ ciphertext: ct }, key, { iv }));
}
