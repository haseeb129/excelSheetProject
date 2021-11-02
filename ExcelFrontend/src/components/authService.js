import jwtDecode from "jwt-decode";
export function logout() {
  localStorage.removeItem("token");
}
export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem("token");
    return jwtDecode(jwt);
  } catch (e) {
    return null;
  }
}
export function AddAdminId(id) {
  localStorage.setItem("adminId", id);
}
export function getCurrentAdmin() {
  try {
    const id = localStorage.getItem("adminId");
    return id;
  } catch (e) {
    return null;
  }
}

export function loginWithJWT(jwt) {
  localStorage.setItem("token", jwt);
}
export function getJWT() {
  return localStorage.getItem("token");
}
export function getHeader() {
  return {
    headers: {
      Authorization: "Bearer ".concat(getJWT()),
    },
  };
}
export default {
  getCurrentUser,
  logout,
  loginWithJWT,
  getJWT,
  getHeader,
};
