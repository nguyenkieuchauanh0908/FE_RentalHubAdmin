export class Utils {
  StringToArray(string: string, delimiter: string) {
    console.log('On prcerssing string to array...');
    string.replaceAll(' ,', ',');
    string.replaceAll(', ', ',');
    const convertedArray = string.split(delimiter);
    console.log('Your converted array is: ', convertedArray);
    return convertedArray;
  }

  findCharAfterNColumn(startChar: String, n: number) {
    if (n === 1) {
      return String.fromCharCode(startChar.charCodeAt(0) + n);
    } else return String.fromCharCode(startChar.charCodeAt(0) + (n - 1));
  }
}
