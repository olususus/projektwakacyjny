document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById("userForm");
    const usersTable = document.getElementById("usersTable");
    const logoutButton = document.getElementById("logoutButton");

    // Pobieranie listy użytkowników po załadowaniu strony
    getUsers();

    // Obsługa dodawania użytkownika
    userForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = userForm.username.value;
        const password = userForm.password.value;
        const role = userForm.role.value;

        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('User added:', data);
            getUsers(); // Odświeżenie listy użytkowników po dodaniu
            userForm.reset();
        })
        .catch(error => {
            console.error('Error adding user:', error);
        });
    });

    // Obsługa usuwania użytkownika
    usersTable.addEventListener("click", function(e) {
        if (e.target.classList.contains('delete-button')) {
            const username = e.target.dataset.username;
            if (confirm(`Czy na pewno chcesz usunąć użytkownika ${username}?`)) {
                fetch(`/users/${username}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('User deleted:', data);
                    getUsers(); // Odświeżenie listy użytkowników po usunięciu
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
            }
        }
    });

    // Obsługa wylogowania
    logoutButton.addEventListener("click", function() {
        fetch('/logout', {
            method: 'POST',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Logout successful');
            window.location.href = '/'; // Przekierowanie na stronę logowania po wylogowaniu
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    });

    // Funkcja do pobierania i wyświetlania listy użytkowników
    function getUsers() {
        fetch('/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(users => {
            renderUsers(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    }

    // Funkcja do renderowania listy użytkowników w tabeli
    function renderUsers(users) {
        const tbody = usersTable.querySelector('tbody');
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td><button class="delete-button" data-username="${user.username}">Usuń</button></td>
            `;
            tbody.appendChild(row);
        });
    }
});
