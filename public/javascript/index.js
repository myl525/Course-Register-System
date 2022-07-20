document.addEventListener('DOMContentLoaded', main);

function main(evt) {
    //close user modal
    const userModalCloseBtn = document.getElementById('userModalCloseBtn');
    userModalCloseBtn.addEventListener('click', closeUserModal);

    //handle switch between register and login form
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    loginLink.addEventListener('click', handleLoginLink);
    registerLink.addEventListener('click', handleRegisterLink);

    //TODO: login and register
    const logInBtn = document.getElementById('logInBtn');
    logInBtn.addEventListener('click', handleLogin);
    const registerBtn = document.getElementById('registerBtn');
    registerBtn.addEventListener('click', handleRegister);
}

//close user modal
function closeUserModal(evt) {
    const userModal = document.getElementById('userModal');
    console.log('clicked');
    userModal.classList.add('element_notdisplay');
}

//open login form
function handleLoginLink(evt) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    registerForm.classList.add('element_notdisplay');
    loginForm.classList.remove('element_notdisplay');
}

//open register form
function handleRegisterLink(evt) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.classList.add('element_notdisplay');
    registerForm.classList.remove('element_notdisplay');
}

//handle focus
function handleFocus(evt) {
    evt.style.border = 'none';
}

//login
async function handleLogin(evt) {
    evt.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'username='+username+'&password='+password
    })

    const data = await res.json();
    
    //TODO form validation
    if(data.loggedIn) {
        window.location.reload();
    }
}

//register
async function handleRegister(evt) {
    evt.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('registerPassword').value;

    const res = await fetch('api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'username='+username+'&name='+name+'&password='+password
    })

    const data = await res.json();
    
    //TODO form validation
    if(data.loggedIn) {
        window.location.reload();
    }
}