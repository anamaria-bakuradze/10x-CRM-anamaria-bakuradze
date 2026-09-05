
if (localStorage.getItem("crm_session")) {
  if ( window.location.href == window.location.origin + "/index.html" || window.location.href == window.location.origin + "/signup.html") {
  // alert("here");
    window.location.replace("../general/dashboard.html");
  } 
} else if (window.location.href != window.location.origin + "/index.html" && window.location.href != window.location.origin + "/signup.html") {
  // alert("here");
    window.location.replace("../index.html");
}

// console.log(localStorage.getItem("crm_session"));
