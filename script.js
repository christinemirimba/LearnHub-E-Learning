// Course Data
const courses = [
    {
        id: "react-fundamentals",
        title: "React Fundamentals",
        description: "Master the basics of React including components, props, state, and hooks. Perfect for beginners starting their journey in modern web development.",
        instructor: "Sarah Johnson",
        duration: "8 hours",
        level: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
        lessons: [
            { id: 1, title: "Introduction to React", duration: "45 min", description: "Learn what React is and why it's popular" },
            { id: 2, title: "JSX and Components", duration: "60 min", description: "Understanding JSX syntax and creating components" },
            { id: 3, title: "Props and State", duration: "75 min", description: "Managing data flow in React applications" },
            { id: 4, title: "Hooks Basics", duration: "90 min", description: "Introduction to useState and useEffect" },
            { id: 5, title: "Building Your First App", duration: "120 min", description: "Create a complete React application" }
        ]
    },
    {
        id: "javascript-advanced",
        title: "Advanced JavaScript",
        description: "Deep dive into JavaScript concepts including closures, async/await, and modern ES6+ features for professional development.",
        instructor: "Mike Chen",
        duration: "12 hours",
        level: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
        lessons: [
            { id: 1, title: "Advanced Functions", duration: "60 min", description: "Closures, currying, and higher-order functions" },
            { id: 2, title: "Async Programming", duration: "90 min", description: "Promises, async/await, and error handling" },
            { id: 3, title: "ES6+ Features", duration: "75 min", description: "Modern JavaScript syntax and features" },
            { id: 4, title: "Design Patterns", duration: "120 min", description: "Common JavaScript design patterns" },
            { id: 5, title: "Performance Optimization", duration: "90 min", description: "Writing efficient JavaScript code" }
        ]
    },
    {
        id: "web-design",
        title: "Web Design Principles",
        description: "Learn essential design principles, color theory, typography, and create beautiful, user-friendly websites that stand out.",
        instructor: "Emma Davis",
        duration: "10 hours",
        level: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
        lessons: [
            { id: 1, title: "Design Fundamentals", duration: "60 min", description: "Basic principles of good design" },
            { id: 2, title: "Color Theory", duration: "75 min", description: "Understanding and using colors effectively" },
            { id: 3, title: "Typography", duration: "60 min", description: "Choosing and pairing fonts" },
            { id: 4, title: "Layout and Composition", duration: "90 min", description: "Creating balanced and effective layouts" },
            { id: 5, title: "Design Tools", duration: "120 min", description: "Introduction to Figma and design workflow" }
        ]
    },
    {
        id: "node-backend",
        title: "Node.js Backend Development",
        description: "Build robust backend applications with Node.js, Express, and MongoDB. Learn RESTful APIs and database management.",
        instructor: "David Rodriguez",
        duration: "15 hours",
        level: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
        lessons: [
            { id: 1, title: "Node.js Basics", duration: "60 min", description: "Introduction to Node.js and npm" },
            { id: 2, title: "Express Framework", duration: "90 min", description: "Building web servers with Express" },
            { id: 3, title: "RESTful APIs", duration: "120 min", description: "Designing and implementing REST APIs" },
            { id: 4, title: "Database Integration", duration: "90 min", description: "Working with MongoDB and Mongoose" },
            { id: 5, title: "Authentication & Security", duration: "120 min", description: "Implementing user authentication" }
        ]
    }
];

// State Management
let currentUser = JSON.parse(localStorage.getItem('learnhub_user')) || null;
let userProgress = JSON.parse(localStorage.getItem('learnhub_progress')) || {};
let currentCourse = null;
let isSignUp = false;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    renderCourses();
    setupEventListeners();
});

// Auth Functions
function initAuth() {
    const authBtn = document.getElementById('authBtn');
    const userDisplay = document.getElementById('userDisplay');
    const authCard = document.querySelector('.auth-card');
    
    if (currentUser) {
        authBtn.textContent = 'Sign Out';
        userDisplay.textContent = `Welcome, ${currentUser.name}`;
        userDisplay.style.display = 'inline';
        if (authCard) authCard.style.display = 'none';
    } else {
        authBtn.textContent = 'Sign In';
        userDisplay.style.display = 'none';
        if (authCard) authCard.style.display = 'block';
    }
}

function setupEventListeners() {
    const authBtn = document.getElementById('authBtn');
    const authForm = document.getElementById('authForm');
    const switchMode = document.getElementById('switchMode');
    
    authBtn.onclick = () => {
        if (currentUser) {
            signOut();
        }
    };
    
    authForm.onsubmit = (e) => {
        e.preventDefault();
        handleAuth();
    };
    
    switchMode.onclick = (e) => {
        e.preventDefault();
        toggleAuthMode();
    };
}

function toggleAuthMode() {
    isSignUp = !isSignUp;
    const authTitle = document.getElementById('authTitle');
    const authName = document.getElementById('authName');
    const switchText = document.getElementById('switchText');
    const switchMode = document.getElementById('switchMode');
    const submitBtn = document.querySelector('#authForm button');
    
    if (isSignUp) {
        authTitle.textContent = 'Sign Up';
        authName.style.display = 'block';
        switchText.textContent = 'Already have an account?';
        switchMode.textContent = 'Sign In';
        submitBtn.textContent = 'Sign Up';
    } else {
        authTitle.textContent = 'Sign In';
        authName.style.display = 'none';
        switchText.textContent = "Don't have an account?";
        switchMode.textContent = 'Sign Up';
        submitBtn.textContent = 'Sign In';
    }
}

function handleAuth() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const name = document.getElementById('authName').value;
    
    if (isSignUp && !name) {
        alert('Please enter your name');
        return;
    }
    
    // Simple auth simulation
    currentUser = {
        email: email,
        name: isSignUp ? name : email.split('@')[0]
    };
    
    localStorage.setItem('learnhub_user', JSON.stringify(currentUser));
    document.getElementById('authForm').reset();
    initAuth();
    renderCourses(); // Re-render to show progress
}

function signOut() {
    currentUser = null;
    localStorage.removeItem('learnhub_user');
    initAuth();
    showHome();
}

// Course Functions
function renderCourses() {
    const courseGrid = document.getElementById('courseGrid');
    courseGrid.innerHTML = courses.map(course => {
        const progress = currentUser ? (userProgress[course.id] || { completed: false, percentage: 0, completedLessons: [] }) : null;
        
        return `
            <div class="course-card" onclick="showCourseDetail('${course.id}')">
                <img src="${course.thumbnail}" alt="${course.title}" class="course-thumbnail">
                <div class="course-card-content">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span>👨‍🏫 ${course.instructor}</span>
                        <span>⏱️ ${course.duration}</span>
                        <span>📊 ${course.level}</span>
                    </div>
                    ${progress ? `
                        <div class="course-progress">
                            <div class="course-progress-text">
                                ${progress.completed ? '✅ Completed' : `${progress.percentage}% Complete`}
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function showCourseDetail(courseId) {
    if (!currentUser) {
        alert('Please sign in to view course details');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    currentCourse = courses.find(c => c.id === courseId);
    if (!currentCourse) return;
    
    document.getElementById('homeView').style.display = 'none';
    document.getElementById('courseDetailView').style.display = 'block';
    
    // Render course header
    document.getElementById('courseTitle').textContent = currentCourse.title;
    document.getElementById('courseInstructor').textContent = `👨‍🏫 ${currentCourse.instructor}`;
    document.getElementById('courseDuration').textContent = `⏱️ ${currentCourse.duration}`;
    document.getElementById('courseLevel').textContent = `📊 ${currentCourse.level}`;
    document.getElementById('courseDescription').textContent = currentCourse.description;
    
    // Render progress
    updateProgress();
    
    // Render lessons
    renderLessons();
}

function renderLessons() {
    const lessonsList = document.getElementById('lessonsList');
    const progress = userProgress[currentCourse.id] || { completedLessons: [] };
    
    lessonsList.innerHTML = currentCourse.lessons.map(lesson => {
        const isCompleted = progress.completedLessons.includes(lesson.id);
        return `
            <div class="lesson-item">
                <input 
                    type="checkbox" 
                    class="lesson-checkbox" 
                    ${isCompleted ? 'checked' : ''}
                    onchange="toggleLesson(${lesson.id})"
                >
                <div class="lesson-content">
                    <h4>${lesson.title}</h4>
                    <p>${lesson.description}</p>
                </div>
                <span class="lesson-duration">${lesson.duration}</span>
            </div>
        `;
    }).join('');
}

function toggleLesson(lessonId) {
    if (!userProgress[currentCourse.id]) {
        userProgress[currentCourse.id] = { completed: false, percentage: 0, completedLessons: [] };
    }
    
    const progress = userProgress[currentCourse.id];
    const index = progress.completedLessons.indexOf(lessonId);
    
    if (index > -1) {
        progress.completedLessons.splice(index, 1);
    } else {
        progress.completedLessons.push(lessonId);
    }
    
    progress.percentage = Math.round((progress.completedLessons.length / currentCourse.lessons.length) * 100);
    
    localStorage.setItem('learnhub_progress', JSON.stringify(userProgress));
    updateProgress();
}

function updateProgress() {
    const progress = userProgress[currentCourse.id] || { completed: false, percentage: 0 };
    document.getElementById('progressPercent').textContent = `${progress.percentage}%`;
    document.getElementById('progressFill').style.width = `${progress.percentage}%`;
    
    const completeBtn = document.getElementById('completeCourseBtn');
    if (progress.completed) {
        completeBtn.textContent = '✅ Course Completed';
        completeBtn.disabled = true;
        completeBtn.style.opacity = '0.6';
    } else {
        completeBtn.textContent = 'Mark Course as Completed';
        completeBtn.disabled = false;
        completeBtn.style.opacity = '1';
        completeBtn.onclick = completeCourse;
    }
}

function completeCourse() {
    if (!userProgress[currentCourse.id]) {
        userProgress[currentCourse.id] = { completedLessons: [] };
    }
    
    userProgress[currentCourse.id].completed = true;
    userProgress[currentCourse.id].percentage = 100;
    
    // Mark all lessons as completed
    userProgress[currentCourse.id].completedLessons = currentCourse.lessons.map(l => l.id);
    
    localStorage.setItem('learnhub_progress', JSON.stringify(userProgress));
    updateProgress();
    renderLessons();
    
    alert('🎉 Congratulations! Course completed!');
}

function showHome() {
    document.getElementById('courseDetailView').style.display = 'none';
    document.getElementById('homeView').style.display = 'block';
    currentCourse = null;
    renderCourses(); // Re-render to update progress
}

// New function to scroll to featured courses
function scrollToFeaturedCourses() {
    showHome();
    // Use setTimeout to ensure the home view is displayed before scrolling
    setTimeout(() => {
        document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}