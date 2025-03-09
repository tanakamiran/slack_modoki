const sqlite3 = require('sqlite3').verbose();

// データベースファイル名
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.error('Connected to SQLite database');
    }
});

//ユーザーテーブル作成
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `, (err) => {
        if(err) {
            console.error('Error creating tabele', err);
        } else {
            console.log('Users table created or already exists');
        }
    });
});

module.exports = db;