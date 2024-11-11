// scripts/security.js
function getSignature(appId, secret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const auth = md5(appId + timestamp);
    return hmacSHA1Encrypt(auth, secret);
}

function md5(str) {
    return CryptoJS.MD5(str).toString(CryptoJS.enc.Hex);
}

function hmacSHA1Encrypt(encryptText, encryptKey) {
    const hash = CryptoJS.HmacSHA1(encryptText, encryptKey);
    return hash.toString(CryptoJS.enc.Base64);
}
