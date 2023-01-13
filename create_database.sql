DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userId VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    PRIMARY KEY (userId)
);

CREATE TABLE issues (
    userId VARCHAR(20) NOT NULL,
    title VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(500) NOT NULL,
    startline DATE NOT NULL,
    deadline DATE NOT NULL,
    state INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId)
);
