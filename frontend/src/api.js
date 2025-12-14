const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const apiRequest = async (path, { method = "GET", body, token } = {}) => {
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }

  return data;
};
