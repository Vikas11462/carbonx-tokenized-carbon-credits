// src/api.js

const API_URL = "http://127.0.0.1:8000";

/**
 * Generic request handler
 */
async function request(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({
      detail: "Unexpected server error"
    }));

    // FastAPI detail can be a string or a list/object (validation errors)
    const message = typeof errorData.detail === 'string'
      ? errorData.detail
      : JSON.stringify(errorData.detail);

    throw new Error(message || "API request failed");
  }

  return res.json();
}

/**
 * Verify a carbon project (AI + Oracle + IPFS + Blockchain)
 */
export async function verifyProject(payload) {
  return request("/verify", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * Reverify project (future simulation / risk recalculation)
 * (stub for advanced MVP)
 */
export async function reverifyProject(projectId) {
  return request(`/reverify/${projectId}`, {
    method: "POST"
  });
}

/**
 * Fetch project verification status
 * pending | verified | minted
 */
export async function getProjectStatus(projectId) {
  return request(`/project/${projectId}/status`);
}

/**
 * Mint carbon credits to a wallet
 */
export async function mintCredits(payload) {
  return request("/mint", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * Fetch carbon credits balance for a wallet
 */
export async function getCarbonCredits(address) {
  return request(`/credits/${address}`);
}
