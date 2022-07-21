document.addEventListener('DOMContentLoaded', main);

function main(evt) {
    //load all courses
    loadCourses();
    //handle search
    const courseSearchBtn = document.getElementById('courseSearchBtn');
    courseSearchBtn.addEventListener('click', handleSearch);
}

/**functions */
async function loadCourses() {
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