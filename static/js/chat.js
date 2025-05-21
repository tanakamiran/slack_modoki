var socket = io(); // サーバーとの接続
let username = 'ゲスト'; // 初期値（後で更新）

document.addEventListener('DOMContentLoaded', () => {
    // セッションからユーザー名取得して表示
    fetch('/session-info')
        .then(res => res.json())
        .then(data => {
            if (data.username) {
                username = data.username;
                document.getElementById('username').textContent = `こんにちは！ ${username} さん`;
            } else {
                document.getElementById('username').textContent = 'こんにちは！ ゲスト さん';
            }
        });

    // ユーザー一覧取得して表示（DM用）
    fetch('/api/users')
        .then(res => res.json())
        .then(users => {
            const userList = document.querySelector('#userList ul');
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.username;
                li.classList.add('user-item');
                li.addEventListener('click', () => {
                    alert(`${user.username}とのDMを開く`);
                });
                userList.appendChild(li);
            });
        });

    // メッセージ送信フォームのイベント登録
    document.getElementById('form').addEventListener('submit', (e) => {
        e.preventDefault();

        var input = document.getElementById('input');
        if (input.value) {
            socket.emit('chat message', { username: username, message: input.value });
            input.value = '';
        }
    });
});

// メッセージ受信時
socket.on('chat message', (data) => {
    const item = document.createElement('li');
    item.textContent = `${data.username}: ${data.message}`;
    document.getElementById('messages').appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

// メッセージの履歴（DB）の読み込み
socket.on('chat history', (messages) => {
    const ul = document.getElementById('messages');
    messages.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `${msg.username}: ${msg.message}`;
        ul.appendChild(li);
    });
});
