export const verifyCsrf = (req) => {
  const cookieToken = req.cookies.get("csrfToken")?.value;
  const headerToken = req.headers.get("x-csrf-token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw new Error("CSRF failed");
  }
};


export const getCsrfToken = async () => {
  const res = await fetch("/api/auth/csrf", {
    credentials: "include",
  });

  const data = await res.json();
  return data.csrfToken;
};