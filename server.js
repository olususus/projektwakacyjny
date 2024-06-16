const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const mkdirp = require('mkdirp');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Tworzenie katalogu logs, jeśli nie istnieje
const logsDir = path.join(__dirname, 'logs');
mkdirp.sync(logsDir);

// Generowanie unikalnego identyfikatora dla pliku dziennika logów
const logFileName = `access-${uuidv4()}.log`;
const accessLogStream = fs.createWriteStream(path.join(logsDir, logFileName), { flags: 'a' });

// Ustawienie morgan do logowania żądań HTTP do odpowiedniego pliku
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const productsFilePath = path.join(__dirname, 'data', 'products.json');

// Zabezpieczone endpointy
app.get('/products', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read products file' });
        }
        try {
            const products = JSON.parse(data);
            res.json(products);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Failed to parse products data' });
        }
    });
});

app.post('/products', (req, res) => {
    const newProduct = req.body;
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read products file' });
        }
        try {
            const products = JSON.parse(data);
            products.push(newProduct);
            fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to write products file' });
                }
                res.status(201).json(newProduct);
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Failed to parse products data' });
        }
    });
});

app.put('/products/:name', (req, res) => {
    const productName = req.params.name;
    const updatedProduct = req.body;
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read products file' });
        }
        try {
            let products = JSON.parse(data);
            products = products.map(product => product.name === productName ? updatedProduct : product);
            fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to write products file' });
                }
                res.status(200).json(updatedProduct);
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Failed to parse products data' });
        }
    });
});

app.delete('/products/:name', (req, res) => {
    const productName = req.params.name;
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read products file' });
        }
        try {
            let products = JSON.parse(data);
            products = products.filter(product => product.name !== productName);
            fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to write products file' });
                }
                res.status(200).json({ message: 'Product deleted' });
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Failed to parse products data' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Logs are being written to ${logFileName}`);
});
