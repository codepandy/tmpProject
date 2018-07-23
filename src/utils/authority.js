// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return sessionStorage.getItem('aijianzi-platform-authority') || '[1]';
}

export function setAuthority(authority) {
  return sessionStorage.setItem('aijianzi-platform-authority', authority);
}
