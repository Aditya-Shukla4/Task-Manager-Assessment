import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_AES_SECRET_KEY;

export const decryptPayload = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error("Decryption Error on Client:", error);
    return null;
  }
};
