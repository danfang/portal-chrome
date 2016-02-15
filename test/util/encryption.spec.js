import { encrypt, decrypt } from '../../app/util/encryption';
import crypto from 'sjcl';

describe('message encryption', () => {
  it('should encrypt a message and then decrypt it successfully', () => {
    // Make a 256-bit key
    const key = '1CDC98ECA8BBC399A9273D8DFF73F99E50846D3B323BC2701400CAC981140CFB';
    const bits = crypto.codec.hex.toBits(key);

    const message = 'Hello, I am a secret secret message.';
    const encrypted = encrypt(bits, message);
    encrypted.should.not.equal(message);

    const decrypted = decrypt(bits, encrypted);
    decrypted.should.equal(message);
  });

  it('should decrypt a base64 message of the form concat(iv, msg)', () => {
    // Generated example from: https://bitwiseshiftleft.github.io/sjcl/demo/
    const key = '1CDC98ECA8BBC399A9273D8DFF73F99E50846D3B323BC2701400CAC981140CFB';
    const bits = crypto.codec.hex.toBits(key);
    const iv = crypto.codec.base64.toBits('hh0j87bpuvgx4E//Nww5Eg==');
    const message = crypto.codec.base64.toBits('4qbkm/fGBPNJDdtsW3AFVzM+rvSLkASv');
    const encrypted = crypto.codec.base64.fromBits(iv.concat(message));

    const decrypted = decrypt(bits, encrypted);
    decrypted.should.equal('Hey you.');
  });
});
