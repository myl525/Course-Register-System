document.addEventListener('DOMContentLoaded', main);

function main(evt) {
    //open auth modal
    const authModalOpenBtn = document.getElementById('authModalOpenBtn');
    authModalOpenBtn.addEventListener('click', openAuthModal);

    //close auth modal
    const authModalCloseBtn = document.getElementById('authModalCloseBtn');
    authModalCloseBtn.addEventListener('click', closeAuthModal);
    window.onclick = function(evt) {
        if (evt.target === document.getElementById('authModal')) {
            closeAuthModal();
        }
    }

    //handle switch between register and login form
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    loginLink.addEventListener('click', handleLoginLink);
    registerLink.addEventListener('click', handleRegisterLink);

    //handle login and register
    const logInBtn = document.getElementById('logInBtn');
    logInBtn.addEventListener('click', handleLogin);
    const registerBtn = document.getElementById('registerBtn');
    registerBtn.addEventListener('click', handleRegister);
}

/**functions */
//open auth Modal
function openAuthModal(evt) {
    const authModal = document.getElementById('authModal');
    authModal.classList.remove('element_notdisplay');
}

//close auth modal
function closeAuthModal(evt) {
    const authModal = document.getElementById('authModal');
    authModal.classList.add('element_notdisplay');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    //reset
    if(loginForm.classList.contains('element_notdisplay')) {
        registerForm.classList.add('element_notdisplay');
        loginForm.classList.remove('element_notdisplay');
    }
    resetModal();
}

//reset modal
function resetModal() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    //clear input fields
    loginForm.reset();
    registerForm.reset();
    //clear error message
    document.querySelectorAll('.error_msg').forEach((msg) => {
        if(!msg.classList.contains('element_notdisplay')) {
            msg.classList.add('element_notdisplay');
        }
    })
    //clear input styling
    document.querySelectorAll('input').forEach((i) => {
        if(i.classList.contains('error_input')) {
            i.classList.remove('error_input');
        }
    })
}

//open login form
function handleLoginLink(evt) {
    evt.preventDefault();

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    registerForm.classList.add('element_notdisplay');
    loginForm.classList.remove('element_notdisplay');
    resetModal();
}

//open register form
function handleRegisterLink(evt) {
    evt.preventDefault();

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.classList.add('element_notdisplay');
    registerForm.classList.remove('element_notdisplay');
    resetModal();
}

//login
async function handleLogin(evt) {
    evt.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const identity = document.getElementById('identity').value;
    const errorMsg = document.getElementById('loginErrorMsg');

    const res = await fetch('api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'username='+username+'&password='+password+'&identity='+identity
    })

    const data = await res.json();
    
    if(data.loggedIn) {
        if(data.identity === 'admin') {
            location.href = '/admin/course';
        }else if(data.identity === 'student') {
            location.href = '/student/home';
        }
    }else {
        document.getElementById('loginUsername').classList.add('error_input');
        document.getElementById('loginPassword').classList.add('error_input');
        if(errorMsg.classList.contains('element_notdisplay')) {
            errorMsg.classList.remove('element_notdisplay');
        }
    }
}

//register
async function handleRegister(evt) {
    evt.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('registerPassword').value;
    const errorMsg = document.getElementById('registerErrorMsg');

    const res = await fetch('api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'username='+username+'&name='+name+'&password='+password
    })

    const data = await res.json();
    
    if(data.loggedIn) {
        location.href = '/student/home';
    }else {
        document.getElementById('registerUsername').classList.add('error_input');
        if(errorMsg.classList.contains('element_notdisplay')) {
            errorMsg.classList.remove('element_notdisplay');
        }
    }
}