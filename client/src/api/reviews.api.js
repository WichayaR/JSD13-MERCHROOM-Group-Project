const BASE = `${import.meta.env.VITE_API_BASE_URL || "/api"}/reviews`;

async function request(path = "", options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Review request failed");
  return data;
}

export const getProductReviews = (productId) =>
  request(`/product/${productId}`);
export const createReview = (review) =>
  request("", { method: "POST", body: JSON.stringify(review) });
