document.addEventListener('DOMContentLoaded', main);

function main(evt) {
    //handle click user icon in navbar
    const navDropdownBtn = document.getElementById('nav_dropdown__btn');
    navDropdownBtn.addEventListener('click', handleUserClick);

    //open user modal
    const openUserModalBtn = document.getElementById('openUserModalBtn');
    openUserModalBtn.addEventListener('click', openUserModal);
    
}

//handle click user icon in navbar
function handleUserClick(evt) {
    const navDropdownItems = document.getElementById('nav_dropdown__items');
    if(navDropdownItems.classList.contains('element_hidden')) {
        navDropdownItems.classList.remove('element_hidden');
    }else {
        navDropdownItems.classList.add('element_hidden');
    }
}

//open user modal
function openUserModal(evt) {
    const userModal = document.getElementById('userModal');
    userModal.classList.remove('element_notdisplay');

    //reset user form
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if(loginForm.classList.contains('element_notdisplay')) {
        loginForm.classList.remove('element_notdisplay');
        registerForm.classList.add('element_notdisplay');
    }
}


