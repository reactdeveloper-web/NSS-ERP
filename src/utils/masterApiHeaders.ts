export const masterApiHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    APIKey: 'NSSAPI4SANSTHANUAT',
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('accessToken');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
