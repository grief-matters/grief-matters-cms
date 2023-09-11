export default function duplicateReferenceValidator(value: any) {
  if (typeof value === "undefined") {
    return true; // Allow undefined values
  }

  const refKeyMap = new Map();
  let duplicateKey = null;

  /* @ts-ignore */
  value.find(({ _key, _ref }) => {
    if (refKeyMap.has(_ref)) {
      duplicateKey = _key;
      return true;
    }

    refKeyMap.set(_ref, _key);
    return false;
  });

  console.log(duplicateKey);

  return duplicateKey
    ? {
        message: "You can't use the same reference twice",
        paths: [{ _key: duplicateKey }],
      }
    : true;
}
