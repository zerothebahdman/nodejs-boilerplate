import { nanoid } from 'nanoid';

export default class HelperClass {
  static titleCase(string: string): string {
    let sentence = string.toLowerCase().split(' ');
    sentence = sentence.filter((str) => str.trim().length > 0);
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(' ');
  }

  static upperCase(string: string): string {
    let sentence = string.toUpperCase().split(' ');
    sentence = sentence.filter((str) => str.trim().length > 0);
    return sentence.join(' ');
  }

  static capitalCase(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  static generateId(num: number = 15): string {
    return nanoid(num);
  }

  static generateOtp<T>(num: T) {
    const otp = Math.floor(Math.random() * 10 ** Number(num));
    return typeof otp === 'number' ? otp : String(otp);
  }
}
