export const isISOString = (val: string) => {
  const d = new Date(val);
  console.log('isISOString', d, val);
  return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
};
