document.addEventListener('DOMContentLoaded', main);

function main(evt) {
    const studentCoursePage = document.getElementById('studentCoursePage');
    const studentHomePage = document.getElementById('studentHomePage');
    if(!studentCoursePage.classList.contains('current_page')) {
        studentCoursePage.classList.add('current_page');
        studentHomePage.classList.remove('current_page');
    }
    //load all courses
    loadCourses();

    //search course
    document.getElementById('courseSearchBtn').addEventListener('click', handleSearch);

    /**Register Course */
    //close modal
    document.getElementById('registerCourseModalCloseBtn').addEventListener('click', closeRegisterModal);
    document.getElementById('registerCourseCancelBtn').addEventListener('click', closeRegisterModal);
    //register
    document.getElementById('registerCourseConfirmBtn').addEventListener('click', registerCourse);

}

/**Load Courses Functions */
async function loadCourses() {
    clearTable();
    //get courses data
    let counter = 0;
    const numberOfCourse = document.getElementById('numberOfCourse');
    const courseSearchStr = '?courseSearchStr=' + document.getElementById('courseSearchInput').value;
    let url = '../api/course'+courseSearchStr;
    const data = await fetch(url);
    const courses = await data.json();
    
    courses.forEach((course) => {
        if(parseInt(course.currentStudents) < parseInt(course.maximumStudents)) {
            printCourse(course);
            counter++;
        }
    })

    numberOfCourse.textContent = counter + ' results';
}

function handleSearch(evt) {
    evt.preventDefault();
    loadCourses();
}

function printCourse(course) {
    const courseTableBody = document.getElementById('courseTableBody');
    const row = document.createElement('tr');
    row.className = 'courseTableRow';
    const columns = ['courseName', 'courseId', 'courseSection', 'maximumStudents', 'currentStudents', 'instructor', 'location'];
    const cells = columns.map((column) => {
        const cell = document.createElement('td');
        cell.textContent = course[column];
        return cell;
    })

    //append elements
    row.append(...cells);
    row.myParam = course;
    row.addEventListener('click', openRegisterModal);
    courseTableBody.appendChild(row);
}

//clear the table
function clearTable() {
    const courseTable = document.getElementById('courseTable');
    const courseTableBody = document.getElementById('courseTableBody');
    courseTableBody.remove();
    //append new table body
    const newTableBody = document.createElement('tbody');
    newTableBody.id = 'courseTableBody';
    newTableBody.className = 'course_table__body';
    courseTable.appendChild(newTableBody);
}

/**Register Course */
function openRegisterModal(evt) {
    document.getElementById('registerCourseModal').classList.remove('element_notdisplay');
    const columns = ['courseName', 'courseId', 'courseSection', 'maximumStudents', 'currentStudents', 'instructor', 'location'];
    document.querySelectorAll('.register_course_input').forEach((input, i) => {
        input.placeholder = evt.target.parentNode.myParam[columns[i]];
    })
}

function closeRegisterModal(evt) {
    location.reload();
}

async function registerCourse(evt) {
    evt.preventDefault();

    let body = '';
    //create body string
    const registerCourseInputs = document.querySelectorAll('.register_course_input');
    registerCourseInputs.forEach((input) => {
        const str = input.name + '=' + input.placeholder + '&';
        body += str;
    })
    body = body.slice(0, -1);

    // send data to the db
    const res = await fetch('../api/student/course/registerCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    const data = await res.json();
    
    if(data.courseRegister) {
        document.getElementById('registerCourseForm').classList.add('element_notdisplay');
        document.getElementById('registerCourseSuccessMsg').classList.remove('element_notdisplay');
    
        setTimeout(() => {
            location.reload();
        }, "1500")
    }else if(data.alreadyRegistered) {
        document.getElementById('registerCourseErrorMsg').classList.remove('element_notdisplay')
    }
}