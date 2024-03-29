import { encrypt, decrypt } from '../../app/util/encryption';

describe('message encryption', () => {
  it('should encrypt a message and then decrypt it successfully', () => {
    const key = '1CDC98ECA8BBC399A9273D8DFF73F99E50846D3B323BC2701400CAC981140CFB';
    const message = 'Hello, I am a secret secret message.';

    const encrypted = encrypt(key, message);
    encrypted.should.not.equal(message);

    const decrypted = decrypt(key, encrypted);
    decrypted.should.equal(message);
  });

  it('should decrypt a message generated by the Java client', () => {
    const key = 'C74530578CABC346A5CC5B37ED36F336CC8F66647C5669EE2076E15792C7D7B9';
    const message = 'KING_OF_DDJ';
    const encrypted = 'KtsrDI9vZ9NIveL0rmu6WtofzvGIxAD+EZQn/F8ai8U=';
    decrypt(key, encrypted).should.equal(message);
  });
});
