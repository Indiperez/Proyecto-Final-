export function setTokenLocalStorage(data: string) {
  localStorage.setItem("AUTH_TOKEN", data);
}

export function getTokenLocalStorage() {
  const token = localStorage.getItem("AUTH_TOKEN");
  return token;
}

export function removeTokenLocalStorage() {
  localStorage.removeItem("AUTH_TOKEN");
}
