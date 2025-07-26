// src/api.js
export async function getUserRole() {
  const res = await fetch("/api/user-role/", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Not authenticated");
  return await res.json();
}
