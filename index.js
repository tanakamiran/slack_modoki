const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const db = require('./db');
const session = require('express-session');
const { error } = require('console');

// アプリケーション設定
const app = express();
const server = http.createServer(app); // HTTPサーバー
const io = new Server(server); // Socket.IOサーバー
const port = 3000;

// ミドルウェア
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // 静的ファイルを配信
app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true
}));

// 認証関連ルート
//ユーザー登録
app.post('/register', async(req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({ error: 'Username and password are required'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err) => {
            if(err) {
                if(err.code === 'SQLITE_CONSTRAINT' ) {
                    return res.status(400).json({error: 'User already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        }
    );
});

// ユーザーログイン
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, user) => {
            if(err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if(!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            const isValid = await bcrypt.compare(password, user.password);
            if(isValid) {
                req.session.username = username;
                return res.status(200).json({ message: 'Login successful' });
            } else {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
        }
    );
});

// チャットページのルート
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.IOを使用したリアルタイム通信
io.on('connection', (socket) => {
    console.log('A user connected');

    // チャットメッセージの受信
    socket.on('chat message', (data) => {
        io.emit('chat message', data); // すべてのクライアントに送信
    });

    // 切断時の処理
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// サーバー起動
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
