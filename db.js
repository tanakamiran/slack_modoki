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

//メッセージテーブル作成
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if(err) {
            console.error('Error creating tabele', err);
        } else {
            console.log('Messages table created or already exists');
        }
    });
});

//　ユーザー一覧取得用関数
function getALLUsers(callback) {
    db.all('SELECT username FROM users', [], (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
    });
}

module.exports = {
    db,
    getALLUsers,
};