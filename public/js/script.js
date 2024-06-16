document.getElementById('logoutButton').addEventListener('click', function() {
    fetch('/logout', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Logout successful') {
            window.location.href = '/login.html';
        }
    });
});

// Funkcja do dodawania produktu do tabeli
function addProductToTable(product) {
    const tbody = document.querySelector('table tbody');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = product.name;
    row.appendChild(nameCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = `${product.price} PLN`;
    row.appendChild(priceCell);

    const actionsCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edytuj';
    editButton.addEventListener('click', function() {
        openEditModal(product, row);
    });
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Usuń';
    deleteButton.addEventListener('click', function() {
        row.remove();
        fetch(`/products/${product.name}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => console.log(data));
    });
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);

    tbody.appendChild(row);
}

// Obsługa formularza dodawania produktu
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;

    if (productName && productPrice) {
        const product = { name: productName, price: productPrice };
        addProductToTable(product);

        document.getElementById('productForm').reset();

        fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
        .then(response => response.json())
        .then(data => console.log(data));
    }
});

// Pobierz produkty z serwera przy ładowaniu strony
fetch('/products')
    .then(response => response.json())
    .then(products => {
        products.forEach(product => {
            addProductToTable(product);
        });
    });

// Funkcja do otwierania modalu edycji produktu
function openEditModal(product, row) {
    const modal = document.getElementById('editModal');
    const closeButton = modal.querySelector('.close');
    const form = modal.querySelector('#editProductForm');
    const editProductName = document.getElementById('editProductName');
    const editProductPrice = document.getElementById('editProductPrice');

    editProductName.value = product.name;
    editProductPrice.value = product.price;

    modal.style.display = 'block';

    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    form.onsubmit = function(event) {
        event.preventDefault();
        
        const updatedProduct = {
            name: editProductName.value,
            price: editProductPrice.value,
        };

        product.name = updatedProduct.name;
        product.price = updatedProduct.price;

        row.cells[0].textContent = updatedProduct.name;
        row.cells[1].textContent = `${updatedProduct.price} PLN`;

        modal.style.display = 'none';

        fetch(`/products/${product.name}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        })
        .then(response => response.json())
        .then(data => console.log(data));
    };
}
