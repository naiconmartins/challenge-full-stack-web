export function generateRa(nextval: number): string {
  const year = String(new Date().getFullYear()).slice(-2);
  const semester = new Date().getMonth() < 6 ? 1 : 2;
  return `${year}${semester}${nextval}`;
}
