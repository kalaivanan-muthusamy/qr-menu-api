export function BooleanTransformer(valueObj) {
  console.log({ valueObj });
  if (typeof valueObj.value === 'boolean') return valueObj.value;
  return valueObj.value === 'true' ? true : false;
}
