import CryptoJS from 'crypto-js';

// Encrypt data at the React UI...
// const data = { uniqueId: '11', phone: '092' };
// const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'privateKey').toString();
// decrypt user unique id and phone number sent from client
const decryptCredential = (ciphertext) => {
  // Decrypt
  const bytes = CryptoJS.AES.decrypt(ciphertext, 'privateKey'); // key should be same with UI encryption key
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export { decryptCredential };
