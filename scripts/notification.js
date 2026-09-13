export function notificationChoice(e) {
    const parent = e.target.closest('.client-cards');
    const notificationTimer = document.createElement('div');
    notificationTimer.innerHTML =
        `
        <span>10 minute</span>
        <span>30 minutes</span>
        <span>1 hour</span>
        <span>custom</span>
    `
    notificationTimer.setAttribute('class', 'notificationTimer');
    parent.appendChild(notificationTimer);

    notificationTimer.querySelectorAll('span').forEach((el) => {
        el.addEventListener('click', setNotificationTimer);
    });

    notificationTimer.classList.add('notificationTimer-active');
    setTimeout(() => {
        collapseNotificationDiv(e);
    }, 2500);

}

export function collapseNotificationDiv(e) {
    try {
        const target = e.target;
        // console.log(e.target);
        target.querySelector('.notificationTimer').remove();
    } catch {
        // console.log('no timer open');
    }
}

function setNotificationTimer(e) {
    const timer = e.currentTarget.textContent;
    let time = 0;
    if (timer == 'custom') {
        console.log(e.currentTarget.parentElement.querySelector('.customTimer'));
        if (!(e.currentTarget.parentElement.querySelector('.customTimer'))) {
            showCustomTimer(e);
        }
    } else if ('1 hour') {
        time = 60;
    } else {
        time = parseInt(timer.slice(0, 2));
        console.log(time);
    };
}

function showCustomTimer(e) {
    const customTimer = document.createElement('form');
    customTimer.innerHTML = `
        <label for="birthday">Day:</label>
        <input type="date" id="birthday" name="birthday">
        <label for="birthday">Time:</label>
        <input type="time" id="time" name="time">
    `;
    customTimer.setAttribute('class', 'customTimer');
    e.currentTarget.parentElement.appendChild(customTimer);
    customTimer.addEventListener('keydown', (e) => {
        if (e.key == "Enter") {
            console.log("saved!");
            customTimer.remove();
        }
    });

}