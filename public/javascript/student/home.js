document.addEventListener('DOMContentLoaded', main);

function main(evt) {
    const studentCoursePage = document.getElementById('studentCoursePage');
    const studentHomePage = document.getElementById('studentHomePage');
    if(!studentHomePage.classList.contains('current_page')) {
        studentHomePage.classList.add('current_page');
        studentCoursePage.classList.remove('current_page');
    }
    //load all courses
    loadCourses();

    /**Withdraw Course */
    //close modal
    document.getElementById('withdrawCourseModalCloseBtn').addEventListener('click', closeWithdrawModal);
    document.getElementById('withdrawCourseCancelBtn').addEventListener('click', closeWithdrawModal);
    //withdraw
    document.getElementById('withdrawCourseConfirmBtn').addEventListener('click', withdrawCourse);

}

/**Load Courses Functions */
async function loadCourses() {
    clearTable();
    //get courses data
    let counter = 0;
    
    let url = '../api/student/myCourse';
    const data = await fetch(url);
    const courses = await data.json();
    
    courses.forEach((course) => {
        printCourse(course);
        counter++;
    })

    numberOfCourse.textContent = counter + ' results';
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
    row.addEventListener('click', openWithdrawModal);
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

/**Withdraw Course */
function openWithdrawModal(evt) {
    document.getElementById('withdrawCourseModal').classList.remove('element_notdisplay');
    const columns = ['courseName', 'courseId', 'courseSection', 'maximumStudents', 'currentStudents', 'instructor', 'location'];
    document.querySelectorAll('.withdraw_course_input').forEach((input, i) => {
        input.placeholder = evt.target.parentNode.myParam[columns[i]];
    })
}

function closeWithdrawModal(evt) {
    location.reload();
}

async function withdrawCourse(evt) {
    evt.preventDefault();

    let body = '';
    //create body string
    const withdrawCourseInputs = document.querySelectorAll('.withdraw_course_input');
    withdrawCourseInputs.forEach((input) => {
        const str = input.name + '=' + input.placeholder + '&';
        body += str;
    })
    body = body.slice(0, -1);

    // send data to the db
    const res = await fetch('../api/student/home/withdrawCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    const data = await res.json();
    
    if(data.courseWithdraw) {
        document.getElementById('withdrawCourseForm').classList.add('element_notdisplay');
        document.getElementById('withdrawCourseSuccessMsg').classList.remove('element_notdisplay');
    
        setTimeout(() => {
            location.reload();
        }, "1500")
    }
}