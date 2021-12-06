const max = 64000;

function encodeText(text, key) {
  let ret = "";
  let a;
  let value;
  for (let i = 0; i < text.length; i++) {
    value = (text.charCodeAt(i) + key) % max;
    a = String.fromCharCode(value);
    ret = ret.concat(a);
  }
  return ret;
}

function decodeText(text, key) {
  let ret = "";
  let a;
  let value;
  for (let i = 0; i < text.length; i++) {
    value = text.charCodeAt(i) - key;
    if (value < 0) value = value + max;
    a = String.fromCharCode(value);
    ret = ret.concat(a);
  }
  return ret;
}
