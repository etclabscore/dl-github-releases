export default (text: any, len: any) => {
  let t = text;

  if (t.length > len) {
    t = `${text.substr(0, len - 3)}...`;
  }

  return `${t}${new Array(len - t.length + 1).join(" ")}`;
};
