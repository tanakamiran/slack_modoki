var socket = io(); // サーバーとの接続

// ユーザー名を取得 (localStorageに保存されている場合)
var username = localStorage.getItem('username') || 'ゲスト';

// ヘッダーにユーザー名を表示
fetch('/session-info')
    .then(res => res.json())
    .then(data => {
        if (data.username) {
            document.getElementById('username').textContent = `こんにちは！ ${data.username} さん`;
        }
    });


// メッセージ送信
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();

    var input = document.getElementById('input');
    if (input.value) {
        socket.emit('chat message', { username: username, message: input.value });
        input.value = '';
    }
});

// メッセージ受信時
socket.on('chat message', (data) => {
    const item = document.createElement('li');
    item.textContent = `${data.username}: ${data.message}`;
    document.getElementById('messages').appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

// メッセージの履歴（DB)の読み込み
socket.on('chat history', (messages) => {
    const ul = document.getElementById('messages');
    messages.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `${msg.username}: ${msg.message}`;
        ul.appendChild(li);
    });
});