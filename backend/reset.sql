-- Drop the existing table if it exists
DROP TABLE IF EXISTS tasks;

-- Create the tasks table with the desired structure
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    priority VARCHAR(50),
    status VARCHAR(50),
    duration VARCHAR(5)
);