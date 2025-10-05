-- LearnHub Database Schema
-- This SQL file can be used with MySQL, PostgreSQL, or any compatible database

-- Create database
CREATE DATABASE IF NOT EXISTS learnhub;
USE learnhub;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    lesson_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- User course progress table
CREATE TABLE course_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    progress_percentage INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (user_id, course_id)
);

-- User lesson progress table
CREATE TABLE lesson_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    lesson_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id)
);

-- Insert sample courses
INSERT INTO courses (id, title, description, instructor, duration, level, thumbnail_url) VALUES
('react-fundamentals', 'React Fundamentals', 'Master the basics of React including components, props, state, and hooks. Perfect for beginners starting their journey in modern web development.', 'Sarah Johnson', '8 hours', 'Beginner', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'),
('javascript-advanced', 'Advanced JavaScript', 'Deep dive into JavaScript concepts including closures, async/await, and modern ES6+ features for professional development.', 'Mike Chen', '12 hours', 'Advanced', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400'),
('web-design', 'Web Design Principles', 'Learn essential design principles, color theory, typography, and create beautiful, user-friendly websites that stand out.', 'Emma Davis', '10 hours', 'Intermediate', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'),
('node-backend', 'Node.js Backend Development', 'Build robust backend applications with Node.js, Express, and MongoDB. Learn RESTful APIs and database management.', 'David Rodriguez', '15 hours', 'Intermediate', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400');

-- Insert sample lessons for React Fundamentals
INSERT INTO lessons (course_id, lesson_number, title, description, duration) VALUES
('react-fundamentals', 1, 'Introduction to React', 'Learn what React is and why it''s popular', '45 min'),
('react-fundamentals', 2, 'JSX and Components', 'Understanding JSX syntax and creating components', '60 min'),
('react-fundamentals', 3, 'Props and State', 'Managing data flow in React applications', '75 min'),
('react-fundamentals', 4, 'Hooks Basics', 'Introduction to useState and useEffect', '90 min'),
('react-fundamentals', 5, 'Building Your First App', 'Create a complete React application', '120 min');

-- Insert sample lessons for Advanced JavaScript
INSERT INTO lessons (course_id, lesson_number, title, description, duration) VALUES
('javascript-advanced', 1, 'Advanced Functions', 'Closures, currying, and higher-order functions', '60 min'),
('javascript-advanced', 2, 'Async Programming', 'Promises, async/await, and error handling', '90 min'),
('javascript-advanced', 3, 'ES6+ Features', 'Modern JavaScript syntax and features', '75 min'),
('javascript-advanced', 4, 'Design Patterns', 'Common JavaScript design patterns', '120 min'),
('javascript-advanced', 5, 'Performance Optimization', 'Writing efficient JavaScript code', '90 min');

-- Insert sample lessons for Web Design
INSERT INTO lessons (course_id, lesson_number, title, description, duration) VALUES
('web-design', 1, 'Design Fundamentals', 'Basic principles of good design', '60 min'),
('web-design', 2, 'Color Theory', 'Understanding and using colors effectively', '75 min'),
('web-design', 3, 'Typography', 'Choosing and pairing fonts', '60 min'),
('web-design', 4, 'Layout and Composition', 'Creating balanced and effective layouts', '90 min'),
('web-design', 5, 'Design Tools', 'Introduction to Figma and design workflow', '120 min');

-- Insert sample lessons for Node.js Backend
INSERT INTO lessons (course_id, lesson_number, title, description, duration) VALUES
('node-backend', 1, 'Node.js Basics', 'Introduction to Node.js and npm', '60 min'),
('node-backend', 2, 'Express Framework', 'Building web servers with Express', '90 min'),
('node-backend', 3, 'RESTful APIs', 'Designing and implementing REST APIs', '120 min'),
('node-backend', 4, 'Database Integration', 'Working with MongoDB and Mongoose', '90 min'),
('node-backend', 5, 'Authentication & Security', 'Implementing user authentication', '120 min');

-- Create indexes for better performance
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_course_progress_user ON course_progress(user_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Create views for common queries
CREATE VIEW user_course_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    c.id as course_id,
    c.title as course_title,
    cp.progress_percentage,
    cp.completed,
    cp.updated_at as last_accessed
FROM users u
LEFT JOIN course_progress cp ON u.id = cp.user_id
LEFT JOIN courses c ON cp.course_id = c.id;

-- Stored procedure to update course progress
DELIMITER //
CREATE PROCEDURE update_course_progress(
    IN p_user_id INT,
    IN p_course_id VARCHAR(50)
)
BEGIN
    DECLARE total_lessons INT;
    DECLARE completed_lessons INT;
    DECLARE new_percentage INT;
    
    -- Count total lessons in course
    SELECT COUNT(*) INTO total_lessons
    FROM lessons
    WHERE course_id = p_course_id;
    
    -- Count completed lessons for user
    SELECT COUNT(*) INTO completed_lessons
    FROM lesson_progress
    WHERE user_id = p_user_id 
    AND course_id = p_course_id 
    AND completed = TRUE;
    
    -- Calculate percentage
    SET new_percentage = FLOOR((completed_lessons / total_lessons) * 100);
    
    -- Update or insert course progress
    INSERT INTO course_progress (user_id, course_id, progress_percentage, completed)
    VALUES (p_user_id, p_course_id, new_percentage, new_percentage = 100)
    ON DUPLICATE KEY UPDATE 
        progress_percentage = new_percentage,
        completed = (new_percentage = 100),
        updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger to auto-update course progress when lesson is completed
DELIMITER //
CREATE TRIGGER after_lesson_complete
AFTER UPDATE ON lesson_progress
FOR EACH ROW
BEGIN
    IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
        CALL update_course_progress(NEW.user_id, NEW.course_id);
    END IF;
END //
DELIMITER ;
