function fetchClients() {
    if(localStorage.getItem("crm_clients")) {
        console.log("local");
        // console.log(crm_clients);
        return JSON.parse(localStorage.getItem("crm_clients"));
    } else {
        console.log("not local");
        // return localStorage.getItem("crm_clients");
        return fetchClientsDummy();
    }
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

function users() {
    return crm_users = JSON.parse(localStorage.getItem("crm_users")) || [];
}

class Client {
    // avatari
    // ტელეფონი, სტატუსი, deal value, „Client since {თარიღი}“ (createdAt, toLocaleDateString).

    constructor(client){
        this.avatar = null;
        this.name = client.firstName+ " " + client.lastName;
        this.notes = [];
        this.company = client.company.name;
        this.email = client.email;
        this.status = client.status ? client.status : "Lead";
        this.dealValue = client.dealValue ? client.dealValue : Math.floor(5+Math.random()*95)*100;
        this.date = new Date().toISOString();
        this.phone = client.phone;
    }
}