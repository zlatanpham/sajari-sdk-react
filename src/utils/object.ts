interface MergeObject {
  [k: string]: any;
}

export function isObject(val: any) {
  return (
    val !== null && typeof val === "object" && Array.isArray(val) === false
  );
}

export const merge = (target: MergeObject, source: MergeObject) => {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = merge(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
};
