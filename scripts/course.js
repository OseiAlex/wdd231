const courses = [
  { subject: 'WDD', number: 130, credits: 3, completed: true },
  { subject: 'CSE', number: 131, credits: 3, completed: false },
  { subject: 'WDD', number: 231, credits: 3, completed: false },
];

function displayCourses(filteredCourses) {
  const container = document.getElementById('courseContainer');
  container.innerHTML = '';
  filteredCourses.forEach(course => {
    const div = document.createElement('div');
    div.classList.add('course');
    if (course.completed) div.classList.add('completed');
    div.textContent = `${course.subject} ${course.number}`;
    container.appendChild(div);
  });
  const totalCredits = filteredCourses.reduce((sum, c) => sum + c.credits, 0);
  document.getElementById('totalCredits').textContent = `Total credits: ${totalCredits}`;
}

document.getElementById('all').addEventListener('click', () => displayCourses(courses));
document.getElementById('cse').addEventListener('click', () => displayCourses(courses.filter(c => c.subject === 'CSE')));
document.getElementById('wdd').addEventListener('click', () => displayCourses(courses.filter(c => c.subject === 'WDD')));

displayCourses(courses);
