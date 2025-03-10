const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

// ユーザー登録
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    console.log("Sending registration request...");

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        console.log("Response status:", response.status);

        if (response.ok) {
            alert('Registration successful!');
        } else {
            const error = await response.json();
            alert(`Registration failed: ${error.error}`);
        }
    } catch (error) {
        console.log("Error during registration:", error);
        alert('Registration failed Network error');
    }
});

// ユーザーログイン
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log("Sending login request...");

    try {
        
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('Login successful!');
            localStorage.setItem('username', username);
            window.location.href = "/chat.html"; // ログイン成功後にチャットページにリダイレクト
        } else {
            const error = await response.json();
            alert(`Login failed: ${error.error}`);
        }
    } catch (erroe) {
        console.error("Error during login:", error);
        alert('Login failed: Network error');
    }
});
