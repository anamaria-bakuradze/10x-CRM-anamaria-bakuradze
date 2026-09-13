


export function filteredClients(e) {
    e.preventDefault();

    const userNumber = JSON.parse(localStorage.getItem("crm_session")) ? JSON.parse(localStorage.getItem("crm_session")).userId : null;
    const crm_clients = JSON.parse(localStorage.getItem(`crm_clients-${userNumber ?? ''}`));

    const form = document.getElementById('filter').querySelector('form');

    const word = form['search'].value;
    const status = form['status'].value;
    // console.log(word, status);
    const nameMatchedCrmClients = crm_clients.filter(user => { return user.name.toLowerCase().includes(word) });
    // console.log(nameMatchedCrmClients);
    // console.log(crm_clients[0].name.toLowerCase().includes(word));
    const finalClients = nameMatchedCrmClients.filter(user => { return user.status === status });
    console.log(finalClients);
    return finalClients;
}