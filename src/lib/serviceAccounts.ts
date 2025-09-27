// Hardcoded mapping of services to 11-digit account numbers
const SERVICE_ACCOUNTS: string[] = [
  "11111111111",
  "22222222222",
  "33333333333",
  "44444444444",
  "55555555555",
  "66666666666",
  "77777777777",
  "88888888888",
  "99999999999",
  "10101010101",
  "12121212121",
  "13131313131",
];


export function getAccountForService(serviceId: string | number | null | undefined): string {
  if (serviceId == null) return SERVICE_ACCOUNTS[0];
  const s = String(serviceId).trim();
  const n = Number(s);
  if (!Number.isNaN(n) && Number.isFinite(n)) {
    const idx = Math.max(0, Math.min(SERVICE_ACCOUNTS.length - 1, Math.floor(n) - 1));
    return SERVICE_ACCOUNTS[idx];
  }
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % SERVICE_ACCOUNTS.length;
  return SERVICE_ACCOUNTS[index];
}

export default SERVICE_ACCOUNTS;
