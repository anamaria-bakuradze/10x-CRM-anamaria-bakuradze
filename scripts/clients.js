// let start = 0;
// let end = 10;
// let start, end;
// if (!JSON.parse(localStorage.getItem('rendered'))) {console.log("here");start =0 ;end = 0;}

class Client {
    static start = 0;
    static end = 10;
    constructor(client){
        this.id = crypto.randomUUID();
        this.avatar = null;
        this.name = client.firstName + " " + client.lastName;
        this.notes = [];
        this.company = client.company.name;
        this.email = client.email;
        this.status = client.status ? client.status : "Lead";
        this.dealValue = client.dealValue ? client.dealValue : Math.floor(5+Math.random()*95)*100;
        this.date = new Date().toISOString();
        this.phone = client.phone;
    }
}

console.log(Client.start, Client.end);

const addBtn = document.getElementById("add-btn");
addBtn.addEventListener("click", addNewClient);
renderClients();


console.log(JSON.parse(localStorage.getItem("crm_clients")));

// -----------------------------------------------------------

function users() {
    return crm_users = JSON.parse(localStorage.getItem("crm_users")) || [];
}

// -----------------------------------------------------------

async function fetchClients(){
  const cached = localStorage.getItem('crm_clients');
  if (cached) return JSON.parse(cached);
  const data = await fetchClientsDummy();
  localStorage.setItem('crm_clients', JSON.stringify(data));
  return data;
}

async function fetchClientsDummy(){
    try {
        const result = await fetch("https://dummyjson.com/users?limit=30").then((response) => response.json());
        const crm_clients_pr = await result.users;
        const crm_clients = [];
        crm_clients_pr.forEach((m) => {
            crm_clients.push(new Client(m));
        })
        // console.log(crm_clients);
        localStorage.setItem("crm_clients", JSON.stringify(crm_clients));
        // console.log(JSON.parse(localStorage.getItem("crm_clients")));
        return crm_clients;
    } catch (error) {
        console.error("Error fetching clients data:", error);
    }
}

async function renderClients(){
    const crm_clients = await fetchClients().then((res)=>res.slice(Client.start,Client.end));

    const container = document.getElementById("clients_container");
    container.innerHTML=`        
        <button id="left">PREVIOUS</button>
        <button id="right">NEXT</button>
    `;

    const containerBtnLeft = document.getElementById('left');
    const containerBtnRigft = document.getElementById('right');
    containerBtnLeft.addEventListener('click', goPrevious);
    containerBtnRigft.addEventListener('click', goNext);

    crm_clients.forEach((m) => {
        const card = document.createElement("div");
        card.innerHTML = 
        `   <span>
                <img src="${m.avatar==null ? './components/logo2.png' : m.avatar}">
                <h5>${m.name}</h5>
            </span>
        `;
        card.setAttribute("class", 'client-cards');
        const bellDiv = document.createElement('div');
        bellDiv.style.position= 'relative';
        const bell = document.createElement('img');
        bell.setAttribute('class', 'bell');
        bell.setAttribute('src', '../components/bell.png');
        const notificationTimer = document.createElement('div');
        notificationTimer.innerHTML = 
        `
            <span>10 minute</span>
            <span>30 minutes</span>
            <span>1 hour</span>
            <span>custom</span>
        `
        notificationTimer.setAttribute('class', 'notificationTimer');
        // notificationTimer.setAttribute('class', 'inactive');
        // bell.addEventListener('click', remainderPopup);
        const rightHalf= document.createElement('div');
        rightHalf.setAttribute('class', 'rightContent');
        rightHalf.innerHTML =`
            <div class="first">
                <span class="deal-value">${m.dealValue}</span>
                <span class="status">${m.status}</span>
                <div><button class="delete-client">Delete</button><button class="edit-client">Edit</button></div>
            </div>
            <div class="second">
                <span class="company">${m.company}</span>
                <textarea class="notes">${m.notes.slice(0,20).length==0 ? "No notes.." : m.notes.slice(0,20)}</textarea>
                <span class="edit-btn">Edit</span>
            </div>
        `;
        console.log(m.status);

        switch (m.status) {
            case 'Lead':     rightHalf.getElementsByClassName('status')[0].style.backgroundColor = '#33123f'; break;
            case 'Contacted':    rightHalf.getElementsByClassName('status')[0].style.backgroundColor = '#521431'; break;
            case 'Won':     rightHalf.getElementsByClassName('status')[0].style.backgroundColor = '#235448';break;
            case 'Lost':     rightHalf.getElementsByClassName('status')[0].style.backgroundColor = '#0B2447';break;
            default: console.log('there was an error with status bg');
        }
        bell.addEventListener('click', (e)=>{
            notificationTimer.classList.add('notificationTimer-active');
            setTimeout((e)=>{notificationTimer.classList.remove('notificationTimer-active');}, 2500);
        });

        notificationTimer.addEventListener('mouseleave', collapseNotificationDiv);
        bellDiv.appendChild(bell);
        bellDiv.appendChild(notificationTimer);
        card.appendChild(bellDiv);
        card.appendChild(rightHalf);
        container.appendChild(card);

    });
}

// -----------------------------------------------------------

function goPrevious() {
    if(Client.start>=10){
        Client.start-=10;
        Client.end-=10;
        const containerBtnLeft = document.getElementById('left');
        const containerBtnRigft = document.getElementById('right');
        containerBtnLeft.removeEventListener('click', goPrevious);
        containerBtnRigft.removeEventListener('click', goNext);
        console.log(Client.start);
        console.log(Client.end);
        renderClients();
    } else if(Client.start >0) {
        console.log("underfloow");
        Client.end-=Client.start;
        Client.start=0;
        renderClients();
    }

}

function goNext() {
    const actualEnd = JSON.parse(localStorage.getItem('crm_clients')).length;
    if(!(Client.end+10 > actualEnd)){
        Client.end+=10;
        Client.start+=10;
        console.log(Client.start);
        console.log(Client.end);
        const containerBtnLeft = document.getElementById('left');
        const containerBtnRigft = document.getElementById('right');
        containerBtnLeft.removeEventListener('click', goPrevious);
        containerBtnRigft.removeEventListener('click', goNext);
        renderClients();
    } else if(Client.end < actualEnd) {
        console.log("overfloow");
        Client.start += actualEnd - Client.end; 
        Client.end = actualEnd;
        renderClients();
    }

}

// -----------------------------------------------------------

function formDisplay() {
    const formContainer = document.createElement('div');
    const forma = document.createElement("form");
    formContainer.setAttribute("class", "floating");
    forma.innerHTML=
    `
        <label for="fname">First name:</label><br>
        <input type="text" id="fname" name="fname"><br>

        <label for="lname">Last name:</label><br>
        <input type="text" id="lname" name="lname"><br>

        <label for="company">Company name:</label><br>
        <input type="text" id="company" name="company"><br>

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email"><br>

        <label for="phone">Phone number:</label><br>
        <input type="text" id="phone" name="phone"><br>

        <label for="deal-value">Deal value:</label><br>
        <input type="text" id="deal-value" name="deal-value"><br>

        <label for="status">Status</laberl><br>
        <select id="status" name="status">
            <option value="Lead">Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Lost">Lost</option>
            <option value="Won">Won</option>
        </select><br>

        <input type="submit" value="Add" />
    `;

    forma.setAttribute('id', 'add-form');
    // <label for="status">Status</laberl><br>

    const overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlay');

    const cancel = document.createElement('button');
    cancel.setAttribute('id', "cancel");

    cancel.textContent='cancel';
    formContainer.appendChild(forma);
    formContainer.appendChild(cancel);
    document.body.appendChild(overlay);
    document.addEventListener('keydown', closeForm);
    return formContainer;
}

function addClient(e) {
    e.preventDefault();
    const frm = e.currentTarget.querySelector('form');
    const firstName = frm["fname"].value;
    const lastName = frm["lname"].value;
    const company = frm["company"].value;
    const email = frm["email"].value;
    const phone = frm["phone"].value;
    const deal = frm["deal-value"].value;
    const status = frm["status"].value;

    const newClient = new Client({firstName: firstName, lastName: lastName, company: {name: company}, email: email, phone: phone, dealValue: deal, status: status});

    const crm_clients = JSON.parse(localStorage.getItem("crm_clients"));
    crm_clients.unshift(newClient);
    localStorage.setItem("crm_clients", JSON.stringify(crm_clients));
    
    renderClients();

    document.querySelector("#add-form").parentElement.remove();
    console.log(document.getElementById('overlay'));
    document.getElementById('overlay').remove();

    const toast = document.createElement("span");
    toast.setAttribute("id", "toast");
    toast.textContent="Client has been added successfully!";
    document.body.appendChild(toast);
    setTimeout(()=> {toast.remove()}, 1000);
    e.currentTarget.removeEventListener("submit", addClient);
}

function closeForm(e){
    if(e.target == document.getElementById('cancel') || e.target == document.getElementById('overlay') || e.key == 'Escape'){
        const formContainer = document.getElementsByClassName('floating')[0];
        console.log(document.getElementsByClassName('add-form').innerHTML);
        // e.preventDefault();
        formContainer.remove();
        document.getElementById('overlay').remove();
        document.removeEventListener('keydown', closeForm);
    }
}

function addNewClient() {
    if(document.getElementsByClassName('floating').length==0){
        console.log(document.getElementsByClassName('floating'));
        const formContainer = formDisplay();
        console.log("here");
        document.body.appendChild(formContainer);
        formContainer.addEventListener("submit", addClient);

        const cancelBtn = document.getElementById('cancel');
        const overlay = document.getElementById('overlay');
        cancelBtn.addEventListener('click', closeForm);
        overlay.addEventListener('click', closeForm);
    }
    
}

// -----------------------------------------------------------

function editClient(){

}

function deleteClient(){

}

// -----------------------------------------------------------
function collapseNotificationDiv(e){
    console.log("here");
    e.target.classList.remove('notificationTimer-active');
}

function setNotification(){
}

function popNotification(){

}

function notify(){

}

// -----------------------------------------------------------

// fetch('https://dummyjson.com/image/150')
// .then(response => response.blob()) // Convert response to blob
// .then(blob => {
//   console.log('Fetched image blob:', blob);
// })

