
class Client {
    static start = 0;
    static end = 10;
    static currentPage = 1;
    static pageTime;
    static idAtAtime = 0;

    constructor(client){
        // this.id = crypto.randomUUID();
        this.id = client.id ? client.id : ++Client.idAtAtime;
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

const userNumber = JSON.parse(localStorage.getItem("crm_session")) ? JSON.parse(localStorage.getItem("crm_session")).userId : null;

const addBtn = document.getElementById("add-btn");
addBtn.addEventListener("click", addNewClient);
const containerBtnLeft = document.getElementById('left');
const containerBtnRigft = document.getElementById('right');
containerBtnLeft.addEventListener('click', goPrevious);
containerBtnRigft.addEventListener('click', goNext);

renderClients();
// -----------------------------------------------------------

function users() {
    return crm_users = JSON.parse(localStorage.getItem("crm_users")) || [];
}

// -----------------------------------------------------------

function reset() {
    localStorage.removeItem('crm_clients-' + userNumber);
    Client.start = 0;
    Client.end = 10;
    Client.currentPage = 1;
    renderClients();
    changePageNumber();
}

async function fetchClients(){
  const cached = localStorage.getItem(`crm_clients-${userNumber? userNumber : ""}`);
  if (cached) return JSON.parse(cached);
  const data = await fetchClientsDummy();
  localStorage.setItem(`crm_clients-${userNumber? userNumber : ""}`, JSON.stringify(data));
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
        const currentUser = localStorage.getItem('crm_users') ? JSON.parse(localStorage.getItem('crm_users')).name : "there was an errod getting a name"; 
        localStorage.setItem(`crm_clients-${userNumber? userNumber : ""}`, JSON.stringify(crm_clients));
        console.log("fetched clients data from dummyjson.com");
        // console.log(JSON.parse(localStorage.getItem("crm_clients")));
        return crm_clients;
    } catch (error) {
        console.error("Error fetching clients data:", error);
    }
}

async function renderClients(){
    const crm_clients = await fetchClients().then((res)=>res.slice(Client.start,Client.end));
    Client.idAtAtime==0 ? Client.idAtAtime = JSON.parse(localStorage.getItem(`crm_clients-${userNumber? userNumber : ""}`)).length : Client.idAtAtime = Client.idAtAtime;

    const container = document.getElementById("clients_container");
    container.innerHTML=``

    crm_clients.forEach((m) => {
        const cardOuter = document.createElement('div');
        cardOuter.setAttribute('class', 'card-outer');
        const card = document.createElement("div");
        card.innerHTML = 
        `   
            <span class="client-id">Id: ${m.id}</span>
            <div class="name-container">
                <span>
                    <img src="${m.avatar==null ? '../components/logo2.png' : m.avatar}">
                    <h5>${m.name}</h5>
                </span>
            </div>
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
                <div><button class="delete-client"><img src="../components/delete.png"></button><button class="edit-client"><img src="../components/edit.png"></button></div>
            </div>
            <div class="second">
                <span class="company">${m.company}</span>
                <textarea class="notes">${m.notes.slice(0,20).length==0 ? "No notes.." : m.notes.slice(0,20)}</textarea>
                <span class="edit-btn">Edit</span>
            </div>
        `;
        console.log(m.status);

        const editBtn = rightHalf.getElementsByClassName('edit-client')[0];
        editBtn.addEventListener('click', (e) => editClient(e));
        const deleteBtn = rightHalf.getElementsByClassName('delete-client')[0];
        deleteBtn.addEventListener('click', (e) => deleteClient(e));

        switch (m.status) {
            case 'Lead':     rightHalf.getElementsByClassName('status')[0].style.backgroundColor = '#33123f'; break;
            case 'Contacted':    rightHalf.getElementsByClassName('status')[0].style.backgroundColor = '#521431'; break;
            case 'Won':     rightHalf.getElementsByClassName('status')[0].style.backgroundColor = '#235448';break;
            case 'Lost':     rightHalf.getElementsByClassName('status')[0].style.backgroundColor = '#0B2447';break;
            default: console.log('there was an error with status bg');
        }
        bell.addEventListener('click', (event1)=>{
            const e = event1
            notificationTimer.classList.add('notificationTimer-active');
            setTimeout(()=>{
                collapseNotificationDiv(e);
            }, 2500);
        });

        notificationTimer.addEventListener('mouseleave', collapseNotificationDiv);
        bellDiv.appendChild(bell);
        bellDiv.appendChild(notificationTimer);
        card.appendChild(bellDiv);
        card.appendChild(rightHalf);

        cardOuter.appendChild(card);
        const moreInfo = document.createElement('div');
        moreInfo.setAttribute('class', 'more-info');
        cardOuter.appendChild(moreInfo);
        container.appendChild(cardOuter);

    });
}

// -----------------------------------------------------------

function changePageNumber(){
    
    console.log('yey');
    const all = localStorage.getItem('crm_clients') ? Math.ceil(JSON.parse(localStorage.getItem('crm_clients')).length / 10) : 3;
    const page = document.getElementsByClassName('page')[0];
    page.textContent = `Page ${Client.currentPage} / ${all}`;
    page.classList.add('page-active');
    clearTimeout(Client.pageTime);
    Client.pageTime = setTimeout(() => { 
            page.classList.remove('page-active');
            Client.pageNote = false;
    }, 1800);
    window.scrollTo({
        top:0,
        behavior: 'smooth'
    });
}

function goPrevious() {
    if(Client.start>=10){
        // console.log(Client.start, Client.end);
        Client.start-=10;
        Client.end=Client.start + 10;
        Client.currentPage -=1;
        renderClients();
        changePageNumber();
        console.log(Client.start, Client.end);

    } else if(Client.start >0) {
        Client.end-=Client.start;
        Client.start=0;
        Client.currentPage -=1;
        renderClients();
        changePageNumber();
    }

}

function goNext() {
    const actualEnd = JSON.parse(localStorage.getItem(`crm_clients-${userNumber? userNumber : ""}`)).length;
    if(!(Client.end+10 > actualEnd)){
        Client.currentPage +=1;
        Client.end+=10;
        Client.start+=10;
        renderClients();
        changePageNumber();
        console.log(Client.start, Client.end);
    } else if(Client.end < actualEnd) {
        Client.currentPage +=1;
        // Client.start += actualEnd - Client.end; 
        Client.start+=10;
        Client.end = actualEnd;
        renderClients();
        changePageNumber();
        console.log(Client.start, Client.end, "end pages");

    }

}

// -----------------------------------------------------------

function formDisplay(someone = null) {
    const formContainer = document.createElement('div');
    const forma = document.createElement("form");
    formContainer.setAttribute("class", "floating");
    forma.innerHTML=
    `
        ${someone ? `
            <h3>Edit Client</h3>
            <span class="client-id">Id: ${someone.id}</span>
            ` : `<h3>Add New Client</h3>`}
        <span>
            <label for="fname">First name:</label>
            <input type="text" id="fname" name="fname" value="${someone ? someone.name.split(' ')[0] : ""}">
        </span>

        <span>
        <label for="lname">Last name:</label>
        <input type="text" id="lname" name="lname" value="${someone ? someone.name.split(' ')[1] : ""}">
        </span>

        <span>
        <label for="company">Company name:</label>
        <input type="text" id="company" name="company" value="${someone ? someone.company.name : ""}">
        </span>

        <span>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="${someone ? someone.email : ""}">
        </span>

        <span>
        <label for="phone">Phone number:</label>
        <input type="text" id="phone" name="phone" value="${someone ? someone.phone : ""}">
        </span>

        <span>
        <label for="deal-value">Deal value:</label>
        <input type="text" id="deal-value" name="deal-value" value="${someone ? someone.dealValue : ""}">
        </span>

        <span>
        <label for="status">Status</label>
        <select id="status" name="status"">
            <option value="Lead" ${someone && someone.status === "Lead" ? "selected" : ""}>Lead</option>
            <option value="Contacted" ${someone && someone.status === "Contacted" ? "selected" : ""}>Contacted</option>
            <option value="Lost" ${someone && someone.status === "Lost" ? "selected" : ""}>Lost</option>
            <option value="Won" ${someone && someone.status === "Won" ? "selected" : ""}>Won</option>
        </select>
        </span>

        <span>
        <button type="submit">${someone ? "Edit" : "Add"}</button>
        <button type="button" id="cancel" onclick="closeForm">cancel</button>
        </span>

    `;

    forma.setAttribute('id', 'add-form');
    // <label for="status">Status</laberl><br>

    const overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlay');

    formContainer.appendChild(forma);
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

    const crm_clients = JSON.parse(localStorage.getItem(`crm_clients-${userNumber? userNumber : ""}`));
    crm_clients.unshift(newClient);
    localStorage.setItem(`crm_clients-${userNumber? userNumber : ""}`, JSON.stringify(crm_clients));

    renderClients();

    document.querySelector("#add-form").parentElement.remove();
    document.getElementById('overlay').remove();

    const toast = document.createElement("span");
    toast.setAttribute("id", "toast");
    toast.textContent="Client has been added successfully!";
    const image = document.createElement("img");
    image.setAttribute("src", "../components/stars.png");
    toast.appendChild(image);
    document.body.appendChild(toast);
    setTimeout(()=> {toast.remove()}, 1000);
    e.currentTarget.removeEventListener("submit", addClient);
    console.log(localStorage.getItem(`crm_clients-${userNumber? userNumber : ""}`));
}

function closeForm(e){
    if(e.target == document.getElementById('cancel') || e.target == document.getElementById('overlay') || e.key == 'Escape' || e.target == document.getElementById('confirm')){
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

function editClient(e){
    if(document.getElementsByClassName('floating').length==0){
        console.log(document.getElementsByClassName('floating'));
        const clients = JSON.parse(localStorage.getItem(`crm_clients-${userNumber? userNumber : ""}`));
        const id = e.target.closest('.client-cards').parentElement.querySelector('.client-id').textContent.split(' ')[1];
        const client = clients.find((m) => m.id == id);
        console.log(client);

        const formContainer = formDisplay(client);
        console.log("here from editing");
        document.body.appendChild(formContainer);
        formContainer.addEventListener("submit", (e) => updateClient(e));

        const cancelBtn = document.getElementById('cancel');
        const overlay = document.getElementById('overlay');
        cancelBtn.addEventListener('click', closeForm);
        overlay.addEventListener('click', closeForm);
    }
}

function updateClient(e) {
    e.preventDefault();
    console.log("updating client");
    const id = e.target.parentElement.querySelector('.client-id').textContent.split(' ')[1];
    // console.log("updating client 1st");

    // const id = id;
    const frm = e.currentTarget.querySelector('form');
    console.log(frm);
    const firstName = frm["fname"].value;
    const lastName = frm["lname"].value;
    const company = frm["company"].value;
    const email = frm["email"].value;
    const phone = frm["phone"].value;
    const deal = frm["deal-value"].value;
    const status = frm["status"].value;

    e.currentTarget.innerHTML="";
    e.currentTarget.style.backgroundColor= "#891212";
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent= "Confirm Edit";
    confirmBtn.setAttribute('id', 'confirm');
    const cancelBtn = document.createElement('button');
    cancelBtn.setAttribute('id', 'cancel');
    cancelBtn.style.backgroundColor= "#891212";
    cancelBtn.textContent = "cancel";
    cancelBtn.addEventListener('click', closeForm);
    e.currentTarget.appendChild(confirmBtn);
    e.currentTarget.appendChild(cancelBtn);
    e.currentTarget.addEventListener("click", (e) => { 
        const crm_clients = JSON.parse(localStorage.getItem(`crm_clients-${userNumber? userNumber : ""}`));
        const client = crm_clients.find((m) => m.id == id);

        client.name = firstName + " " + lastName;
        client.company = company;
        client.email = email;
        client.phone = phone;
        client.dealValue = deal;
        client.status = status;

        crm_clients[crm_clients.findIndex((m) => m.id == id)] = client;
        localStorage.setItem(`crm_clients-${userNumber? userNumber : ""}`, JSON.stringify(crm_clients));

        renderClients();

        console.log(document.querySelector(".floating"));
        document.querySelector(".floating").remove();
        document.getElementById('overlay').remove();

        const toast = document.createElement("span");
        toast.setAttribute("id", "toast");
        toast.textContent="Client has been updated successfully!";
        const image = document.createElement("img");
        image.setAttribute("src", "../components/stars.png");
        toast.appendChild(image);
        document.body.appendChild(toast);
        setTimeout(()=> {toast.remove()}, 1000);
        e.currentTarget.removeEventListener("submit", updateClient);
    });

}


function deleteClient(e){
    const id = e.target.closest('.client-cards').parentElement.querySelector('.client-id').textContent.split(' ')[1];
    const confirmForm = document.createElement('div');
    confirmForm.setAttribute("class", "floating");
    const overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlay');

    document.body.appendChild(overlay);
    document.body.appendChild(confirmForm);
    document.addEventListener('keydown', closeForm);
        //    cancelBtn.addEventListener('click', closeForm);
    overlay.addEventListener('click', closeForm);

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent= "Confirm Edit";
    confirmBtn.setAttribute('id', 'confirm');
    confirmBtn.addEventListener('click', (e) => {
        const crm_clients = JSON.parse(localStorage.getItem(`crm_clients-${userNumber? userNumber : ""}`));
        const clientIndex = crm_clients.findIndex((m) => m.id == id);
        if(clientIndex !== -1){
            crm_clients.splice(clientIndex, 1);
            localStorage.setItem(`crm_clients-${userNumber? userNumber : ""}`, JSON.stringify(crm_clients));
            renderClients();
            closeForm(e);
        }
    });
        
    const cancelBtn = document.createElement('button');
    cancelBtn.setAttribute('id', 'cancel');
    cancelBtn.style.backgroundColor= "#891212";
    cancelBtn.textContent = "cancel";
    cancelBtn.addEventListener('click', closeForm);
    confirmForm.style.backgroundColor= "#891212";
    confirmForm.appendChild(confirmBtn);
    confirmForm.appendChild(cancelBtn);

}

function displayClient(){
    const moreInfo = document.getElementsByClassName('more-info');
    console.log(moreInfo);
    // moreInfo.classList.add('more-info-active');
}

displayClient();

// -----------------------------------------------------------
function collapseNotificationDiv(e){
    const card= e.target.closest('.client-cards');
    card.querySelector('.notificationTimer').classList.remove('notificationTimer-active');
}

function setNotification(){
    //gives you a window for custom remainder with day choice and time choice, and a message box for the remainder message.
}

function popNotification(){
    // this will be used for a toast.
}

function notify(){
    // this will be called when the time is up, and will pop a notification with the message and a link to the client. THIS COMMENT IS AI's IDEA.
}




// -----------------------------------------------------------

// fetch('https://dummyjson.com/image/150')
// .then(response => response.blob()) // Convert response to blob
// .then(blob => {
//   console.log('Fetched image blob:', blob);
// })

