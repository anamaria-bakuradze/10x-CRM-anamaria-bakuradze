const page = window.location.pathname.replace(/\/+$/, '');
const path = page.split('/').pop().replace(/\.html$/, '');
console.log(path);

if (localStorage.getItem("crm_session")) {
  if (['index', 'signup'].includes(path)) {
    // alert("here");
    window.location.replace("../general/dashboard.html");
  }
} else if (!['index', 'signup'].includes(path)) {
  // alert("here");
  window.location.replace("../index.html");
}
