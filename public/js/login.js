document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById("login-form");
    const loginButton = document.getElementById("login-form-submit");
    const loginErrorMsg = document.getElementById("login-error-msg");

    loginButton.addEventListener("click", function(e) {
        e.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        // Wysyłanie danych logowania do serwera
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Logowanie udane - przekierowanie do panelu administracyjnego
            localStorage.setItem('sessionToken', data.token); // Zapis tokena sesji (przy założeniu, że serwer zwraca token)
            window.location.href = 'index.html';
        })
        .catch(error => {
            // Logowanie nieudane - wyświetlenie komunikatu o błędzie
            loginErrorMsg.style.opacity = 1;
            console.error('Error logging in:', error);
        });
    });
});
