var socket = io(); // サーバーとの接続

// ユーザー名を取得 (localStorageに保存されている場合)
var username = localStorage.getItem('username') || 'ゲスト';

// ヘッダーにユーザー名を表示
document.getElementById('username-display').textContent = username;

// フォーム送信時の処理
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();

    var input = document.getElementById('input');
    if (input.value) {
        socket.emit('chat message', { username: username, message: input.value });
        input.value = '';
    }
});

// メッセージ受信時の処理
socket.on('chat message', (data) => {
    const item = document.createElement('li');
    item.textContent = `${data.username}: ${data.message}`;
    document.getElementById('messages').appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
