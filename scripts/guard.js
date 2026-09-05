
if (localStorage.getItem("crm_session")) {
  if ( window.location.href == window.location.origin + "/auth/index.html" || window.location.href == window.location.origin + "/auth/signup.html") {
  // alert("here");
    window.location.replace("../dashboard.html");
  } 
} else if (window.location.href != window.location.origin + "/auth/index.html" && window.location.href != window.location.origin + "/auth/signup.html") {
  // alert("here");
    window.location.replace("../auth/index.html");
}

// console.log(localStorage.getItem("crm_session"));
