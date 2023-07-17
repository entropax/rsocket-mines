export function setSessionStorage() {
    if (!sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', undefined);}
    if (!sessionStorage.getItem('pass')) {
        sessionStorage.setItem('pass', undefined);}
}
