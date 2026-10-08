const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
  token?: string;
  orgId?: string;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  // Retrieve token from options or localStorage in browser
  const token = options.token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const orgId = options.orgId || (typeof window !== "undefined" ? localStorage.getItem("current_org_id") : null);
  if (orgId) {
    headers.set("X-Organization-Id", orgId);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "An unexpected error occurred";
    try {
      const errJson = await response.json();
      errorDetail = errJson.message || errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
