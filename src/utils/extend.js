export default function () {
  const newObj = {};
  for (let i = 0; i < arguments.length; i++) {
    const obj = arguments[i];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
}
