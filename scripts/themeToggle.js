
const bigSquare = document.createElement('div');
bigSquare.setAttribute('class', "big-square");

const smallSquare = document.createElement('div');
smallSquare.setAttribute('class', "small-square");


const toggleLightBtn = document.createElement('button');
toggleLightBtn.setAttribute('class', "toggle-theme-light");
toggleLightBtn.innerHTML = `<img src="../components/toggle-off.png" alt="toggle theme">`;
// document.body.appendChild(toggleBtn);

const toggleDarkBtn = document.createElement('button');
toggleDarkBtn.setAttribute('class', "toggle-theme-dark");
toggleDarkBtn.innerHTML = `<img src="../components/toggle-on.png" alt="toggle theme">`;
// document.body.appendChild(toggleBtn);

bigSquare.appendChild(smallSquare);
bigSquare.appendChild(toggleLightBtn);
bigSquare.appendChild(toggleDarkBtn);
document.body.appendChild(bigSquare);
toggleLightBtn.addEventListener('click', (e) => toggleTheme(e));
toggleDarkBtn.addEventListener('click', (e) => toggleTheme(e));

try {
    localStorage.getItem('crm_theme');
    const bd = document.getElementsByClassName('body')[0] ? document.getElementsByClassName('body')[0] : null;
    switch (localStorage.getItem('crm_theme')) {
        case 'dark-theme':
            document.body.classList.add('dark-theme');
            try { bd.classList.add('dark-theme') } catch { console.log('no body element, because we\'re in authorization') };
            toggleDarkBtn.classList.add('rotate-dark');
            toggleLightBtn.classList.add('rotate-light');
            break;
        case 'light-theme':
            document.body.classList.remove('dark-theme');
            try { bd.classList.remove('dark-theme') } catch { console.log('no body element, because we\'re in authorization') };
            toggleDarkBtn.classList.remove('rotate-dark');
            toggleLightBtn.classList.remove('rotate-light');
            break;
    }
} catch {
    localStorage.setItem('crm_theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme');
}

function toggleTheme(e) {
    localStorage.setItem('crm_theme', localStorage.getItem('crm_theme') == 'dark-theme' ? 'light-theme' : 'dark-theme');
    // const switchTheme = document.getElementsByClassName('big-square')[0];
    const bd = document.getElementsByClassName('body')[0] ? document.getElementsByClassName('body')[0] : null;


    switch (localStorage.getItem('crm_theme')) {
        case 'dark-theme':
            document.body.classList.add('dark-theme');
            try { bd.classList.add('dark-theme') } catch { console.log('no body element, because we\'re in authorization') };

            toggleDarkBtn.classList.add('rotate-dark');
            toggleLightBtn.classList.add('rotate-light');
            break;
        case 'light-theme':
            document.body.classList.remove('dark-theme');
            try { bd.classList.remove('dark-theme') } catch { console.log('no body element, because we\'re in authorization') };

            toggleDarkBtn.classList.remove('rotate-dark');
            toggleLightBtn.classList.remove('rotate-light');
            break;
    }
    // e.target.closest('button').querySelector('img').setAttribute('src', localStorage.getItem('crm_theme') == 'dark-theme' ? '../components/toggle-on.png' : '../components/toggle-off.png');
}