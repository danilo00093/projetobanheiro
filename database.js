const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Criação da tabela de usuários
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id varchar (30),
            password VARCHAR (30) NOT NULL
        )
    `);

    // Inserção de usuários para testes
    db.run(`
        INSERT OR IGNORE INTO users (id, password)
        VALUES ('user1', 'password1'),
               ('danilo', '123'),
               ('victor', '123')
    `);
});

module.exports = db;
