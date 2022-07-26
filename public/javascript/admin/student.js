document.addEventListener('DOMContentLoaded', main);

function main(evt) {
    const adminCoursePage = document.getElementById('adminCoursePage');
    const adminStudentPage = document.getElementById('adminStudentPage');
    if(!adminStudentPage.classList.contains('current_page')) {
        adminStudentPage.classList.add('current_page');
        adminCoursePage.classList.remove('current_page');
    }

    //load all students
    loadStudents();

    //search student
    document.getElementById('studentSearchBtn').addEventListener('click', handleSearch);

    //open register course modal
    document.getElementById('registerCourseBtn').addEventListener('click', openRegisterCourseModal);

    //close register course modal
    document.getElementById('registerCourseModalCloseBtn').addEventListener('click', closeRegisterCourseModal);
    document.getElementById('registerCourseCancelBtn').addEventListener('click', closeRegisterCourseModal);

    //register course
    
}

async function loadStudents(givenSearchStr) {
    clearTable();
    //get students data
    const numberOfStudent = document.getElementById('numberOfStudent');
    let studentSearchStr = '';
    if(givenSearchStr) {
        studentSearchStr = givenSearchStr;
    }else {
        studentSearchStr = '?studentSearchStr=' + document.getElementById('studentSearchInput').value;
    }
    let url = '../api/admin/student' + studentSearchStr;
    const data = await fetch(url);
    const students = await data.json();

    students.forEach((student) => {
        printStudent(student);
    })

    const studentCourseTableContainer = document.getElementById('studentCourseTableContainer');
    if(students.length == 1) {
        loadStudentCourses(...students);
    }else {
        if(!studentCourseTableContainer.classList.contains('element_notdisplay')){
            studentCourseTableContainer.classList.add('element_notdisplay');
        }
    }

    numberOfStudent.textContent = students.length + ' results';
}

async function loadStudentCourses(student) {
    clearStudentCourseTable();
    //get student's courses data
    const courses = student.courses;
    courses.forEach((course) => {
        printCourse(course);
    })

    document.getElementById('studentCourseTableContainer').classList.remove('element_notdisplay');
    document.getElementById('registerCourseConfirmBtn').addEventListener('click', handleRegisterCourse);
    document.getElementById('registerCourseConfirmBtn').myParam = student;
}

function handleSearch(evt) {
    evt.preventDefault();
    loadStudents();
}

function printStudent(student) {
    const studentTableBody = document.getElementById('studentTableBody');
    const row = document.createElement('tr');
    row.className = 'studentTableRow';
    const columns = ['username', 'name'];
    const cells = columns.map((column) => {
        const cell = document.createElement('td');
        cell.textContent = student[column];
        return cell;
    })
    row.append(...cells);
    row.addEventListener('click', handleClickStudent);
    studentTableBody.appendChild(row);
}

function handleClickStudent(evt) {
    const str = '?studentSearchStr=' + evt.target.parentNode.children[0].textContent;
    loadStudents(str);
}

function clearTable() {
    const studentTable = document.getElementById('studentTable');
    const studentTableBody = document.getElementById('studentTableBody');
    studentTableBody.remove();
    //append new table body
    const newTableBody = document.createElement('tbody');
    newTableBody.id = 'studentTableBody';
    newTableBody.className = 'student_table__body';
    studentTable.appendChild(newTableBody);
}

function clearStudentCourseTable() {
    const studentCourseTable = document.getElementById('studentCourseTable');
    const studentCourseTableBody = document.getElementById('studentCourseTableBody');
    studentCourseTableBody.remove();
    //append new table body
    const newTableBody = document.createElement('tbody');
    newTableBody.id = 'studentCourseTableBody';
    newTableBody.className = 'student_course_table__body';
    studentCourseTable.appendChild(newTableBody); 
}

function printCourse(course) {
    const studentCourseTableBody = document.getElementById('studentCourseTableBody');
    const row = document.createElement('tr');
    row.className = 'studentCourseTableRow';
    const columns = ['courseName', 'courseId', 'courseSection', 'maximumStudents', 'currentStudents', 'instructor', 'location'];
    const cells = columns.map((column) => {
        const cell = document.createElement('td');
        cell.textContent = course[column];
        return cell;
    })

    //append elements
    row.append(...cells);
    studentCourseTableBody.appendChild(row);
}

function openRegisterCourseModal(evt) {
    document.getElementById('registerCourseModal').classList.remove('element_notdisplay');
}

function closeRegisterCourseModal(evt) {
    if(evt) {
        evt.preventDefault();
    }

    document.getElementById('registerCourseModal').classList.add('element_notdisplay');
    document.getElementById('registerCourseForm').reset();
    if(!document.getElementById('registerCourseErrorMsg').classList.contains('element_notdisplay')) {
        document.getElementById('registerCourseErrorMsg').classList.add('element_notdisplay');
    }
    
}

async function handleRegisterCourse(evt) {
    evt.preventDefault();
    const student = evt.target.myParam;
    let body = 'username=' + student.username + '&';
    //create body string
    const registerCourseInputs = document.querySelectorAll('.register_course_input');
    registerCourseInputs.forEach((input) => {
        const str = input.name + '=' + input.value + '&';
        body += str;
    })
    body = body.slice(0, -1);
    //send data to the db
    const res = await fetch('../api/admin/student/registerCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    const data = await res.json();
    console.log(data);

    const errorMsg = document.getElementById('registerCourseErrorMsg');
    if(data.courseNotFound) {
        errorMsg.textContent = 'Course Not Found';
        errorMsg.classList.remove('element_notdisplay');
    }else if(data.courseFull){
        errorMsg.textContent = 'Course is Full';
        errorMsg.classList.remove('element_notdisplay');
    }else if(data.alreadyRegistered) {
        errorMsg.textContent = 'Repeat Registration';
        errorMsg.classList.remove('element_notdisplay');
    }else if(data.courseRegister) {
        closeRegisterCourseModal();
        loadStudents('?studentSearchStr='+student.username);
    }
}