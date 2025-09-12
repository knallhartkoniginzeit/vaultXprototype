export const apiRequest = async (endpoint, data = {}, method = "POST") => {
  const res = await fetch(`http://localhost:8000/${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
