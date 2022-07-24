document.addEventListener('DOMContentLoaded', main);

function main(evt) {
    //load all courses
    loadCourses();
    
    //handle search
    const courseSearchBtn = document.getElementById('courseSearchBtn');
    courseSearchBtn.addEventListener('click', handleSearch);

    //open add course modal
    const addCourseBtn = document.getElementById('addCourseBtn');
    addCourseBtn.addEventListener('click', openAddCourseModal); 
    //close add course modal
    const courseModalCloseBtn = document.getElementById('courseModalCloseBtn');
    courseModalCloseBtn.addEventListener('click', closeAddCourseModal);
    const addCourseCancelBtn = document.getElementById('addCourseCancelBtn');
    addCourseCancelBtn.addEventListener('click', closeAddCourseModal);
    //handle add course
    const addCourseConfirmBtn = document.getElementById('addCourseConfirmBtn');
    addCourseConfirmBtn.addEventListener('click', addCourse);

}

/**functions */
async function loadCourses(pageNumber=1) {
    clearTable();
    //get courses data
    const courseSearchStr = '?courseSearchStr=' + document.getElementById('courseSearchInput').value;
    let url = '../api/admin/course'+courseSearchStr;
    const data = await fetch(url);
    const courses = await data.json();
    
    courses.forEach((course) => {
        printCourse(course);
    })
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
    //add options cell
    const optionCell = document.createElement('td');
    optionCell.textContent = '...';
    optionCell.id = 'option'+course.courseId+course.courseSection;
    optionCell.className = 'courseOption';
    cells.push(optionCell);

    row.append(...cells);
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
    newTableBody.className = 'course_table_body';
    courseTable.appendChild(newTableBody);
}

/**add course functions */
//open add course modal
function openAddCourseModal(evt) {
    const addCourseModal = document.getElementById('addCourseModal');
    const addCourseForm = document.getElementById('addCourseForm');
    
    if(addCourseForm.classList.contains('element_notdisplay')) {
        addCourseForm.classList.remove('element_notdisplay');
    }

    addCourseModal.classList.remove('element_notdisplay');
}

//close add course modal
function closeAddCourseModal(evt) {
    // evt.preventDefault();

    // const addCourseModal = document.getElementById('addCourseModal');
    // const addCourseForm = document.getElementById('addCourseForm');

    // addCourseForm.reset();
    // addCourseModal.classList.add('element_notdisplay');
    location.reload();
}

//add course
async function addCourse(evt) {
    evt.preventDefault();
    let body = '';
    //create body string
    const addCourseInputs = document.querySelectorAll('.add_course_input');
    addCourseInputs.forEach((input) => {
        const str = input.name + '=' + input.value + '&';
        body += str;
    })
    body = body.slice(0, -1);

    //send data to the db
    const res = await fetch('../api/admin/addCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    const data = await res.json();
    console.log(data);
    if(data.alreadyExists) {
        //course already exists
        const errorMsg = document.getElementById('addCourseErrorMsg');
        errorMsg.classList.remove('element_notdisplay');
        const addCourseInputs = document.querySelectorAll('.add_course_input');
        for(let i=0; i<3; i++) {
            addCourseInputs[i].classList.add('error_input');
        }
    }else {
        //add course to db successfully
        const addCourseForm = document.getElementById('addCourseForm');
        const addCourseSuccessMsg = document.getElementById('addCourseSuccessMsg');
        const errorMsg = document.getElementById('addCourseErrorMsg');

        if(!errorMsg.classList.contains('element_notdisplay')) {
            errorMsg.classList.add('element_notdisplay');
        }

        addCourseForm.classList.add('element_notdisplay');
        addCourseSuccessMsg.classList.remove('element_notdisplay');

        setTimeout(() => {
            location.reload();
        }, "1500")
    }
}

