import { userNumber, renderClientsCl, Client, toast } from "./clients.js";

export function formDisplay(someone = null) {
    const formContainer = document.createElement('div');
    const forma = document.createElement("form");
    formContainer.setAttribute("class", "floating");
    forma.innerHTML =
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

export function validateClient(e) {
    e.preventDefault();
    let success = true;
    const frm = e.currentTarget.querySelector('form');
    const firstName = frm["fname"];
    const lastName = frm["lname"];
    let company = frm["company"].value;
    const email = frm["email"];
    const phone = frm["phone"];
    const deal = frm["deal-value"].value ? frm["deal-value"].value : 0;
    const status = frm["status"].value ? frm["status"].value : 'Lead';

    if (firstName.value.trim().length == 0) {
        success = false;
        firstName.placeholder = "Please Enter a Valid Name";
        firstName.style.border = '2px solid var(--red)';
    }
    if (lastName.value.trim().length == 0) {
        success = false;
        lastName.placeholder = "Please Enter a Valid Lastname";
        lastName.style.border = '2px solid var(--red)';
    }
    if (company.trim().length == 0) {
        company = 'Entrepreneur';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value.trim().length < 0 || !(emailRegex.test(email.value.trim()))) {
        success = false;
        email.placeholder = "Please Enter a Valid Email";
        email.style.border = '2px solid var(--red)';
    }
    const georgianPhoneRegex = /^(\+995)?5\d{8}$/;

    if (phone.value.trim().length < 0 || !(georgianPhoneRegex.test(phone.value.trim()))) {
        success = false;
        phone.innerHTML = "Please Enter a Valid Phone Number";
        phone.style.border = '2px solid var(--red)';
    }

    if (success) {
        const newClient = { firstName: firstName.value, lastName: lastName.value, company: { name: company }, email: email.value, phone: phone.value, dealValue: deal, status: status };
        document.querySelector("#add-form").parentElement.remove();
        document.getElementById('overlay').remove();

        e.currentTarget.removeEventListener("submit", validateClient);
        addClient(newClient);
    }
}

function addClient(newClient) {
    const newClientObj = new Client(newClient);

    const crm_clients = JSON.parse(localStorage.getItem(`crm_clients-${userNumber ? userNumber : ""}`));
    crm_clients.unshift(newClientObj);
    localStorage.setItem(`crm_clients-${userNumber ? userNumber : ""}`, JSON.stringify(crm_clients));

    renderClientsCl();

    toast("Client was added successfully!");
}

export function closeForm(e) {
    if (e.target == document.getElementById('cancel') || e.target == document.getElementById('overlay') || e.key == 'Escape' || e.target == document.getElementById('confirm')) {
        const formContainer = document.getElementsByClassName('floating')[0];
        formContainer.remove();
        document.getElementById('overlay').remove();
        document.removeEventListener('keydown', closeForm);
    }
}

export function addNewClient() {
    if (document.getElementsByClassName('floating').length == 0) {
        const formContainer = formDisplay();
        document.body.appendChild(formContainer);
        formContainer.addEventListener("submit", validateClient);

        const cancelBtn = document.getElementById('cancel');
        const overlay = document.getElementById('overlay');
        cancelBtn.addEventListener('click', closeForm);
        overlay.addEventListener('click', closeForm);
    }

}
