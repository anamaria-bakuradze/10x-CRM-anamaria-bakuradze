// import { Client } from "./client.js";


const userNumber = JSON.parse(localStorage.getItem("crm_session")) ? JSON.parse(localStorage.getItem("crm_session")).userId : null;
console.log("User number: " + userNumber);
fetchClients();

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
    Client.idAtAtime = JSON.parse(localStorage.getItem(`crm_clients-${userNumber? userNumber : ""}`)).length;

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