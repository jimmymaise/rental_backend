import * as aesjs from 'aes-js';
import { Base64 } from 'js-base64';

const baseAesKey: number[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
];
const baseAesIv: number[] = [
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
];

export function generateAesKeys(
  text: string,
): {
  aesKey: number[];
  aesIv: number[];
} {
  const tmpTextBytes = aesjs.utils.utf8.toBytes(text);
  const textBytes = tmpTextBytes.slice(0, 16);
  let aesKey = [...textBytes];
  let aesIv = [...textBytes];

  if (aesKey.length <= 16) {
    aesKey = [...aesKey, ...baseAesKey.slice(0, 16 - aesKey.length)];
  }

  if (aesIv.length <= 16) {
    aesIv = [...aesIv, ...baseAesIv.slice(0, 16 - aesIv.length)];
  }

  return {
    aesKey,
    aesIv,
  };
}

export function EncryptByAesCBCPassword(
  text: string,
  password: string,
): string {
  const { aesKey, aesIv } = generateAesKeys(password);
  return EncryptByAesCBC(text, aesKey, aesIv);
}

export function DecryptByAesCBCPassword(
  text: string,
  password: string,
): string {
  const { aesKey, aesIv } = generateAesKeys(password);
  return DecryptObjByAesCBC(text, aesKey, aesIv);
}

export function EncryptByAesCBC(
  text: string,
  aesKey: number[],
  aesIv: number[],
): string {
  let encryptedString = '';
  const processingText = Base64.encode(text);

  const aesCbc = new aesjs.ModeOfOperation.cbc(aesKey, aesIv);
  const textBytes = aesjs.utils.utf8.toBytes(processingText);
  const trunkTextBytes = [];
  let newChunk: any[] = [];
  textBytes.forEach((textByte: number) => {
    newChunk.push(textByte);

    if (newChunk.length >= 16) {
      trunkTextBytes.push(newChunk);

      const encryptedBytes = aesCbc.encrypt(newChunk);
      const hexStr = aesjs.utils.hex.fromBytes(encryptedBytes);

      encryptedString += hexStr;

      newChunk = [];
    }
  });

  let spaceNumber = 0;
  if (newChunk.length > 0) {
    for (let i = newChunk.length; i < 16; i++) {
      newChunk.push(32);
      spaceNumber++;
    }

    const encryptedBytes = aesCbc.encrypt(newChunk);
    const hexStr = aesjs.utils.hex.fromBytes(encryptedBytes);
    encryptedString += hexStr;
  }

  if (spaceNumber > 0) {
    encryptedString += `.${spaceNumber}`;
  }

  return Base64.encode(encryptedString);
}

export function DecryptObjByAesCBC(
  encryptedStr: string,
  aesKey: number[],
  aesIv: number[],
): any {
  const inputText = Base64.decode(encryptedStr);

  const splitedEncryptStr = inputText.split('.');
  const spaceNumber = splitedEncryptStr[1] ? Number(splitedEncryptStr[1]) : 0;

  let processingEncryptStr = splitedEncryptStr[0];
  if (processingEncryptStr.length % 32 !== 0) {
    return '';
  }

  const aesCbc = new aesjs.ModeOfOperation.cbc(aesKey, aesIv);
  let decryptedStr = '';

  while (processingEncryptStr.length) {
    const newHexStr = processingEncryptStr.substr(0, 32);

    const encryptedBytes = aesjs.utils.hex.toBytes(newHexStr);

    const decryptedBytes = aesCbc.decrypt(encryptedBytes);
    decryptedStr += aesjs.utils.utf8.fromBytes(decryptedBytes);

    processingEncryptStr = processingEncryptStr.substr(32);
  }

  if (spaceNumber > 0) {
    decryptedStr = decryptedStr.substring(0, decryptedStr.length - spaceNumber);
  }

  const result = Base64.decode(decryptedStr);

  return result;
}
