export function maskPhone(phone: string | null | undefined) {
  if (!phone) return '';
  const str = String(phone);
  if (str.length <= 5) return str;
  const first = str.slice(0, 3);
  const last = str.slice(-2);
  const middleLen = Math.max(0, str.length - 5);
  return first + '*'.repeat(middleLen) + last;
}
