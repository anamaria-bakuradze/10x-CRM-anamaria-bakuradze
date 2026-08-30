renderClients();

function renderClients(){
    const crm_clients = fetchClients();
    // .then((res)=> {res.data}).then((data)=>{return data});
    console.log(crm_clients);

    crm_clients.forEach((m) => {
        const card = document.createElement("div");
        card.innerHTML = 
        `
        <div class="client-cards">
            <img src="${m.avatar}">
            <h5>${m.name}</h5>
            <p class="deal-value">${m.dealValue}</p>
            <p class="status">${m.status}</p>
            <button class="delete-client">Delete</button>
        </div>
        `;
        card.setAttribute("class", "client-cards-container");
        const container = document.getElementById("clients_container");
        console.log(container);
        container.appendChild(card);
    });
}

const forma = document.createElement("form");
forma.setAttribute("class", "floating");
// forma.setAttribute("method", "POST");
// forma.setAttribute("action", "clients.html");
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
    <input type="submit" value="Add">
    <button id="cancel">Cancel</button>
`;

const addBtn = document.getElementById("add-btn");
addBtn.addEventListener("click", addNewClient);
const addedNow=false;

function addNewClient() {
    document.body.appendChild(forma);
    const cancelBtn = document.getElementById["cancel"];
    cancelBtn.addEventListener("click", (e) =>{
        e.preventDefault();
        forma.remove();
    })

    forma.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = forma["fname"].value +" " + forma["lname"].value;
        const company = forma["company"].value;
        const email = forma["email"].value;
        const phone = forma["phone"].value;
        const deal = forma["deal-value"].value;
        const status = forma["status"].value;

        const newClient = new Client({name: name, company: {name: company}, email: email, phone: phone, dealValue: deal, status: status});
        const crm_clients = JSON.parse(localStorage.getItem("crm_clients"));
        crm_clients.unshift(newClient);
        localStorage.setItem("crm_clients", JSON.stringify(crm_clients));
        console.log(JSON.parse(localStorage.getItem("crm_clients")));
        
        renderClients();

        forma.remove();

        const toast = document.createElement("p");
        toast.setAttribute("id", "toast");
        toast.textContent="Client has been added successfully!";
        document.body.appendChild(toast);
        setTimeout(()=> {toast.remove()}, 1000);
    })
    
}