class App {
    static page = 'Dashboard';
    // constructor(){

    // }
}

const screenH = window.innerHeight;
const bodyEl = document.getElementById('body');

console.log(screenH);
console.log(bodyEl.offsetHeight);
console.log(bodyEl.offsetHeight > screenH);


if (!(bodyEl.offsetHeight > screenH)) {
    bodyEl.style.height = `${screenH}px`;

}




const icon = document.createElement('img');
icon.setAttribute('src', '../components/logo2.png');
icon.setAttribute('id', 'icon');

const nav = document.createElement('nav');
nav.innerHTML =
    `    
    <div>
        <div></div>
    </div>


    <div id="links">
        <a href="dashboard.html">Dashboard</a>
        <a href="clients.html">Clients</a>
        <a href="profile.html">Profile</a>
    </div>
    <div><span></span></div>
    <div><span></span></div>
    <div id="buttons"><button><img src="../components/logout.png" alt="log out"><span>Log out</span></button></div>
`;
nav.setAttribute('class', 'inactive');
nav.setAttribute('class', 'pop');
nav.setAttribute('id', 'nav');

const openNav = document.createElement('div');
openNav.setAttribute('id', 'open-menu');
const navHolder = document.createElement('div');
navHolder.setAttribute('style', 'grid-area: e');

const leftSide = document.createElement('div');
leftSide.setAttribute('style', 'grid-area: g');

document.body.appendChild(navHolder);
document.body.appendChild(leftSide);
document.body.appendChild(openNav);
document.body.appendChild(nav);
document.body.appendChild(icon);

document.getElementById('open-menu').addEventListener('mouseenter', () => { document.querySelector('nav').classList.remove('inactive'); });
document.querySelector('nav').addEventListener('mouseleave', () => { document.querySelector('nav').classList.add('inactive'); });
document.getElementById('icon').addEventListener('click', () => { window.location.replace('dashboard.html') });

document.querySelectorAll('nav div a').forEach((e) => {
    e.addEventListener('click', () => {
        App.page = e.textContent;
    });
    // console.log(e.textContent);
    // console.log(App.page);

});

document.querySelectorAll('nav div a').forEach((e) => {
    // console.log(e.textContent);
    e.classList.remove('emphasis');
    if (e.textContent === App.page) { e.classList.add('emphasis') }
});

// console.log(App.page);

const buttons = document.querySelectorAll('nav>div>button');
buttons[0].addEventListener('click', logOut);

const toastContainer = document.createElement('div');
toastContainer.setAttribute('id', 'toast-container');
document.body.appendChild(toastContainer);

// ------------------------------------------------------

localStorage.setItem('crm_theme', 'light-theme');

function logOut() {
    console.log("Logging out...");
    localStorage.removeItem("crm_session");
    window.location.replace("../index.html");
}


// had to cut this out <span id="icon-holder"></span>
