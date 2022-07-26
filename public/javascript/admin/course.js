document.addEventListener('DOMContentLoaded', main);

function main(evt) {
    const adminCoursePage = document.getElementById('adminCoursePage');
    const adminStudentPage = document.getElementById('adminStudentPage');
    if(!adminCoursePage.classList.contains('current_page')) {
        adminCoursePage.classList.add('current_page');
        adminStudentPage.classList.remove('current_page');
    }

    //load all courses
    loadCourses();
    
    //handle search
    const courseSearchBtn = document.getElementById('courseSearchBtn');
    courseSearchBtn.addEventListener('click', handleSearch);

    /**course options */
    //close option menu if click outside
    window.onclick = (evt) => {
        if(!(evt.target.classList.contains('course_option_container') || evt.target.classList.contains('course_option_cell'))) {
            document.querySelectorAll('.course_option_container').forEach((option) => {
                option.parentNode.classList.remove('active');
                option.remove();
            })
        }
    }

    //close edit modal
    document.getElementById('courseOptionModalCloseBtn').addEventListener('click', closeEditCourseModal);
    document.getElementById('editCourseCancelBtn').addEventListener('click', closeEditCourseModal);

    //handle edit course
    document.getElementById('editCourseConfirmBtn').addEventListener('click', editCourse);

    /**add course */
    //open add course modal
    const addCourseBtn = document.getElementById('addCourseBtn');
    addCourseBtn.addEventListener('click', openAddCourseModal); 
    
    //close add course modal
    const addCourseModalCloseBtn = document.getElementById('addCourseModalCloseBtn');
    addCourseModalCloseBtn.addEventListener('click', closeAddCourseModal);
    const addCourseCancelBtn = document.getElementById('addCourseCancelBtn');
    addCourseCancelBtn.addEventListener('click', closeAddCourseModal);
    
    //handle add course
    const addCourseConfirmBtn = document.getElementById('addCourseConfirmBtn');
    addCourseConfirmBtn.addEventListener('click', addCourse);

}

/**functions */
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
        printCourse(course);
        counter++;
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
    //add options cell
    const optionCell = document.createElement('td');
    optionCell.className = 'course_option_cell';
    let optionCellIdStr = '';
    columns.forEach((column) => { 
        if(column !== 'currentStudents')
        optionCellIdStr += (course[column] + '/'); 
    })

    optionCell.id = optionCellIdStr.slice(0,-1);
    optionCell.textContent = '...';
    optionCell.addEventListener('click', openCourseOptions);
    
    cells.push(optionCell);
    //append elements
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
    newTableBody.className = 'course_table__body';
    courseTable.appendChild(newTableBody);
}

//course options
function openCourseOptions(evt) {
    const current = evt.target;
    //close own options
    const inactive = current.classList.toggle('active');
    if(inactive) {
        //close option for other courses
        const ownOption = current.querySelector('.course_option_container');
        const allOptions = document.querySelectorAll('.course_option_container');
        allOptions.forEach((option) => {
            if(option !== ownOption) {
                option.parentNode.classList.remove('active');
                option.remove();
            }
        })
        //create options element
        const courseOptionContainer = document.createElement('ul');
        courseOptionContainer.className = 'course_option_container';
        const options = ['edit', 'delete'];
        options.forEach((option) => {
            const ele = document.createElement('li');
            ele.textContent = option;
            ele.id = option + '/' + evt.target.id;
            ele.className = 'course_option';
            if(option === 'edit') {
                ele.addEventListener('click', openEditCourseModal);
            }else {
                ele.addEventListener('click', deleteCourse);
            }

            courseOptionContainer.appendChild(ele);
        })
        current.appendChild(courseOptionContainer);
    }else {
        current.querySelector('.course_option_container').remove();
    }
}

//edit option
function openEditCourseModal(evt) { 
    evt.stopPropagation();
    document.getElementById('courseOptionModal').classList.remove('element_notdisplay');
    //adjust placeholder
    const placeHolderStr = evt.target.id.split('/').slice(1);
    const editCourseInputs = document.querySelectorAll('.edit_course_input');
    editCourseInputs.forEach((input, i) => {
        input.placeholder = placeHolderStr[i];
    })
}

async function editCourse(evt) {
    evt.preventDefault();
    
    //create body string
    let body = '';
    let updates = '';
    const editCourseInputs = document.querySelectorAll('.edit_course_input');
    body += 'courseId='+ editCourseInputs[1].placeholder + '&courseSection=' + editCourseInputs[2].placeholder;
    editCourseInputs.forEach((input) => {
        if(input.value) {
            updates += '&' + input.name + '=' + input.value;
        }
    })
    
    //send data to the db
    const res = await fetch('../api/admin/editCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body + updates
    });

    const data = await res.json();
    if(data.update) {
        //add course to db successfully
        const editCourseForm = document.getElementById('editCourseForm');
        const editCourseSuccessMsg = document.getElementById('editCourseSuccessMsg');

        editCourseForm.classList.add('element_notdisplay');
        editCourseSuccessMsg.classList.remove('element_notdisplay');

        setTimeout(() => {
            location.reload();
        }, "1500")
    }
}

function closeEditCourseModal(evt) {
    location.reload();
}

//delete option
async function deleteCourse(evt) {
    evt.stopPropagation();

    const str = evt.target.id.split('/');
    let body = 'courseId=' + str[2] + '&courseSection=' + str[3];
    
    console.log(body);

    const res = await fetch('../api/admin/deleteCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    const data = await res.json();

    if(data.delete) {
        //delete successfully
        document.getElementById('courseOptionModal').classList.remove('element_notdisplay');
        document.getElementById('editCourseForm').classList.add('element_notdisplay');
        document.getElementById('deleteCourseSuccessMsg').classList.remove('element_notdisplay');

        setTimeout(() => {
            location.reload();
        }, "1500")
    }
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

