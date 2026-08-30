
function greet(){
    const crm_users = JSON.parse(localStorage.getItem("crm_users"));
    const crm_session = JSON.parse(localStorage.getItem("crm_session"));
    document.getElementById("name").textContent =` ${crm_users.find(user => user["id"] === crm_session["userId"])["fullname"]}`;
}

function displayTime(){
    var time = document.getElementById("time");
    time.innerHTML = new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString();
    setInterval(function() {
        time.innerHTML = new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString();
    }, 1000);
}

const dashCard = document.querySelectorAll('.dashboard-cards div');
dashCard.forEach((each)=>{each.style.height = `${dashCard.clientWidth*40/100}px`;});

const pipelinesContainer = document.querySelectorAll('.pipelines div');
pipelinesContainer.forEach((each)=>{each.style.height = `${each.clientWidth*50/100}px`;})
// the code above is for visuals only

function renderStatistics(){
    const crm_clients = JSON.parse(localStorage.getItem("crm_clients"));
    const cards = document.querySelectorAll('.dashboard-cards div p');
    cards[0].textContent = crm_clients.length;

    const activeDeals = crm_clients.filter((each)=>{return each.status == "contacted"});
    cards[1].textContent = activeDeals.length;

    const wonDeals = crm_clients.filter((each)=>{return each.status == "won"});
    var dealTotal=0;
    wonDeals.forEach((deal)=>{
        dealTotal+=deal.dealValue;
    })
    cards[2].textContent = dealTotal;
    //document.write(crm_clients.filter(user => user["dealStatus"] === "Won").reduce((sum, user) => sum + user["revenue"], 0));

    let thisMonday = new Date();
    let month ='';
    switch (thisMonday.getMonth()) {
            case 0: {month = "01"; break;}
            case 1: {month = "02"; break;}
            case 2: {month = "03"; break;}
            case 3: {month = "04"; break;}
            case 4: {month = "05"; break;}
            case 5: {month = "06"; break;}
            case 6: {month = "07"; break;}
            case 7: {month = "08"; break;}
            case 8: {month = "09"; break;}
            case 9: {month = "10"; break;}
            case 10: {month = "11"; break;}
            case 11: {month = "12"; break;}
    }
    if (thisMonday.getDay() !=0) {thisMonday = new Date(`${thisMonday.getFullYear()}-${month}-${thisMonday.getDate()-thisMonday.getDay()+1}`)}
    const wonThisWeek = crm_clients.filter((each)=>{return (each.status == "Won" && Date.parse(each.date) > Date.parse(thisMonday) ) });
    cards[3].textContent = wonThisWeek.length;

    // document.write(crm_clients.filter(user => new Date(user["createdAt"]) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length);
}
function renderPipeline(){
    const cards = document.querySelectorAll('.pipelines div p');
    const crm_clients = JSON.parse(localStorage.getItem("crm_clients"));
    
    cards[0].textContent = crm_clients.filter((each)=>{return (each.status === "lead" || each.status === "Lead")}).length;
    cards[0].parentElement.style.backgroundColor='#33123f';//hsl(305.26,26.27%,42.55%)

    cards[1].textContent = crm_clients.filter((each)=>{return each.status === "contacted"}).length;
    cards[1].parentElement.style.backgroundColor='#521431';//hsl(347.37,63.33%,52.94%)
    
    cards[2].textContent = crm_clients.filter((each)=>{return each.status === "won"}).length;
    cards[2].parentElement.style.backgroundColor='#235448'; //hsl(191.71,21.24%,37.84%)

    cards[3].textContent = crm_clients.filter((each)=>{return each.status === "lost"}).length;
    cards[3].parentElement.style.backgroundColor='#0B2447'; //hsl(253.33,17.48%,40.39%)

}
function renderClients(){
    const crm_clients = JSON.parse(localStorage.getItem("crm_clients")).slice(0,4);
    const cards = document.querySelectorAll('.recent-clients div');
    
    for(i=0; i<4;i++){
        const photo =document.createElement('img');
        photo.setAttribute('src', crm_clients[i].avatar);
        const name =document.createElement('h4');
        name.textContent = crm_clients[i].fullname;
        const status = document.createElement('span');
        status.style.display= 'block';
        
        switch (crm_clients[i].status) {
            case 'lead': status.style.backgroundColor = "#33123f"; break;
            case 'contacted': status.style.backgroundColor = "#521431"; break;
            case 'won': status.style.backgroundColor = "#235448"; break;
            case 'lost': status.style.backgroundColor = "#0B2447"; break;
        }
        status.textContent = crm_clients[i].status;
        const deal = document.createElement('span');
        deal.textContent = crm_clients[i].dealValue;
        deal.setAttribute('class', 'dealValue');

        cards[i].appendChild(photo);
        cards[i].appendChild(name);
        cards[i].appendChild(status);
        cards[i].appendChild(deal);
    }
}

greet();
displayTime();
renderStatistics();
renderPipeline();
renderClients();

/* <script>document.write(crm_clients.length);</script> */
