
if (localStorage.getItem("crm_session")) {
  if (['index', 'signup'].includes(page)) {
    // alert("here");
    window.location.replace("../general/dashboard.html");
  }
} else if (!['index', 'signup'].includes(page)) {
  // alert("here");
  window.location.replace("../index.html");
}

// console.log(localStorage.getItem("crm_session"));

const page = window.location.pathname.split('/').pop().replace(/\.html$/, '');

if (!['index', 'signup'].includes(page)) {
  // not on index or signup
}
