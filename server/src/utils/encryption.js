const CryptoJS = require("crypto-js");

// Aes secret key
const SECRET_KEY =
  process.env.AES_SECRET_KEY ||
  "teri_temporary_secret_key_jo_tujhe_env_me_dalni_hai";

// function to encrypt
const encryptPayload = (data) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY,
    ).toString();
    return ciphertext;
  } catch (error) {
    console.error("Encryption Error:", error);
    throw new Error("Data encryption failed");
  }
};

// Fucntion to decrypt
const decryptPayload = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error("Decryption Error:", error);
    throw new Error("Data decryption failed - Invalid payload");
  }
};

module.exports = { encryptPayload, decryptPayload };
