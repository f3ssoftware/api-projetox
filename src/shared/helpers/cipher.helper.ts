import * as CryptoJS from 'crypto-js';

const encrypt = (word: string) => {
  return CryptoJS.AES.encrypt(word, 'pagstar').toString();
};

const decrypt = (word: string) => {
  const bytes = CryptoJS.AES.decrypt(word, 'pagstar');
  return bytes.toString(CryptoJS.enc.Utf8);
};

export { encrypt, decrypt };
