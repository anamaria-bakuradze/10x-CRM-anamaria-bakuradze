const page = window.location.pathname.replace(/\/+$/, '');
const path = page.split('/').pop().replace(/\.html$/, '');

if (localStorage.getItem("crm_session")) {
  if (['index', 'signup'].includes(page)) {
    // alert("here");
    window.location.replace("../general/dashboard.html");
  }
} else if (!['index', 'signup'].includes(page)) {
  // alert("here");
  window.location.replace("../index.html");
}
