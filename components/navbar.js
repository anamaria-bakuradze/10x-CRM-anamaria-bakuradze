

// console.log(localStorage.getItem("theme"));

// var darkvar = false;
function logOut() {
    console.log("Logging out...");
    localStorage.removeItem("crm_session");
    window.location.replace("../auth/index.html");
}

// document.body.classList.add("light-theme");

function dark(){
    // if (localStorage["theme"] == null) {localStorage.setItem("theme", "light");}
    var darkvar = localStorage.getItem("theme")=="dark" ? true : false;
    if (!darkvar) {
        localStorage["theme"] = "dark";
        // document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    } else {
        localStorage["theme"] = "light";
        document.body.classList.remove("dark-theme");
        // document.body.classList.add("light-theme");
    }
    console.log(localStorage.getItem("theme"));
}

function Nav() {
    if (localStorage["theme"] == null) {localStorage.setItem("theme", "light"); }
    if (localStorage["theme"] == "dark") {
        console.log("here")
        // document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    }

    document.getElementById("navContainer").innerHTML = `
        <button class="logo"><a href="dashboard.html"><img src="../components/logo2.png" alt="Logo" class="logo"/></a></button>
        <nav class="navigation">
            <ul>
                <li class="inactive"><a href="dashboard.html">Dashboard</a></li>
                <li class="inactive"><a href="clients.html">Clients</a></li>
                <li class="inactive"><a href="profile.html">Profile</a></li>
            </ul>
        </nav>

        <div></div>
        <div class="buttons" id="buttons">
            <ul>
                <li><button id="logOutBtn" ></button></li>
                <li><button id="themeToggle" aria-label="Toggle Theme"></button></li>
            </ul>
        </div>
        `;
    switch(localStorage.getItem("currentPage")){
        case "1": {
            document.querySelectorAll('nav ul li')[0].classList.remove("inactive");
            document.querySelectorAll('nav ul li')[0].classList.add("active");
            break;}
        case "2": {
            document.querySelectorAll('nav ul li')[1].classList.remove("inactive");
            document.querySelectorAll('nav ul li')[1].classList.add("active");
            break;}
        case "3": {
            document.querySelectorAll('nav ul li')[2].classList.remove("inactive");
            document.querySelectorAll('nav ul li')[2].classList.add("active");
            break;}
    }

    document.querySelector('nav').addEventListener("click", (e) =>
    {   
        var currentPage= 1;
        switch(e.target.textContent) {
            case "Dashboard" : {currentPage =1; break;}
            case "Clients" : { currentPage =2; break;}
            case "Profile" : { currentPage =3; break;}
        }

        localStorage.setItem("currentPage", currentPage);
    })


    document.getElementById("logOutBtn").addEventListener("click", logOut);
    document.getElementById("themeToggle").addEventListener("click", dark);
    document.getElementById("logOutBtn").addEventListener("mouseenter", (e) => {
        document.getElementById("logOutBtn").style.backgroundColor="grey";
        document.getElementById("logOutBtn").textContent="Logout";
    });
    document.getElementById("logOutBtn").addEventListener("mouseleave", (e) => {
        document.getElementById("logOutBtn").style.backgroundColor="white";
        document.getElementById("logOutBtn").textContent="";
    });

    document.getElementById("themeToggle").addEventListener("mouseenter", (e) => {
        document.getElementById("themeToggle").style.backgroundColor="grey";
        document.getElementById("themeToggle").textContent="Switch";
    });
    document.getElementById("themeToggle").addEventListener("mouseleave", (e) => {
        document.getElementById("themeToggle").style.backgroundColor="white";
        document.getElementById("themeToggle").textContent="";
    });

}