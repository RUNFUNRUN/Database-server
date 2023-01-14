DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userId VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    PRIMARY KEY (userId)
);

CREATE TABLE issues (
    title VARCHAR(50) NOT NULL,
    userId VARCHAR(20) NOT NULL,
    description VARCHAR(500) NOT NULL,
    startline DATE NOT NULL,
    deadline DATE NOT NULL,
    state INTEGER NOT NULL,
    PRIMARY KEY (title),
    FOREIGN KEY (userId) REFERENCES users(userId)
);
