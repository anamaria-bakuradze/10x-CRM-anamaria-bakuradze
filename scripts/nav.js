

const icon = document.createElement('img');
icon.setAttribute('src', '../components/logo2.png');
icon.setAttribute('id', 'icon');

const nav = document.createElement('nav');
nav.innerHTML = 
`
    <div>
        <div id="icon-holder"></div>
    </div>
    <div id="links">
        <a href="dashboard.html">Dashboard</a>
        <a href="clients.html">Clients</a>
        <a href="profile.html">Profile</a>
    </div>
    <div><span></span></div>
    <div><span></span></div>
    <div id="buttons"><button><img src="../components/logout.png" alt="log out"></button><span></span><button><img src="../components/toggle-off.png" alt="toggle theme"></button></div>
`;
nav.setAttribute('class', 'inactive');

const openNav = document.createElement('div');
openNav.setAttribute('id', 'open-menu');


document.body.appendChild(openNav);
document.body.appendChild(nav);
document.body.appendChild(icon);

document.getElementById('open-menu').addEventListener('mouseenter', ()=>{ document.querySelector('nav').classList.remove('inactive');});
document.querySelector('nav').addEventListener('mouseleave', ()=>{ document.querySelector('nav').classList.add('inactive');});
document.getElementById('icon').addEventListener('click', ()=>{window.location.replace('dashboard.html')});

const buttons = document.querySelectorAll('nav>div>button');
buttons[0].addEventListener('click', logOut);
buttons[1].addEventListener('click', (e) => toggleTheme(e));

// ------------------------------------------------------

localStorage.setItem('crm_theme', 'light-theme');

function toggleTheme(e) {
    localStorage.setItem('crm_theme', localStorage.getItem('crm_theme') == 'dark-theme' ? 'light-theme' : 'dark-theme');
    switch (localStorage.getItem('crm_theme')){
        case 'dark-theme':
            document.body.classList.add('dark-theme');
            break;
        case 'light-theme':
            document.body.classList.remove('dark-theme');
            break;
    }
    e.target.closest('button').querySelector('img').setAttribute('src', localStorage.getItem('crm_theme') == 'dark-theme' ? '../components/toggle-on.png' : '../components/toggle-off.png');
}

function logOut() {
    console.log("Logging out...");
    localStorage.removeItem("crm_session");
    window.location.replace("../index.html");
}
