console.log(JSON.parse(localStorage.getItem('crm_users')).find(user => user.id === JSON.parse(localStorage.getItem('crm_session')).userId));
console.log(JSON.parse(localStorage.getItem('crm_session')));

function renderProfile() {
    const user = JSON.parse(localStorage.getItem('crm_users')).find(user => user.id === JSON.parse(localStorage.getItem('crm_session')).userId)
   ;
    document.getElementById('name').textContent =  user.fullname;

    document.querySelector('.name-card div>span:nth-child(2)').textContent = user.email + " - " + (user.company? user.company : "company not specified" ) ;
    document.querySelector('.name-card div>span:last-child').textContent = "Member since: " + user.createdAt.slice(0,10);

    document.querySelector('.edit-details form>input:first-child').value = user.fullname;
    document.querySelector('.edit-details form>input:last-child').value = user.company;
    document.querySelector('.edit-details form').addEventListener('submit', (e)=>{
        e.preventDefault();
        
    })
}

renderProfile();