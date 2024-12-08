const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); 
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const getUsers = () => {
    const data = fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8');
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return res.json({ message: 'เข้าสู่ระบบสำเร็จ', token: 'sample-token' });
    } else {
        return res.status(401).json({ message: 'ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง' });
    }
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const userExists = users.some(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' });
    }
    const newUser = { username, password };
    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' });
});

app.get('/api/product', (req, res) => {
    const products = JSON.parse(fs.readFileSync('./product.json', 'utf-8'));
    res.json(products);
});

app.get('/api/topuphistory', (req, res) => {
    const topuphtr = JSON.parse(fs.readFileSync('./topuphistory.json', 'utf-8'));
    res.json(topuphtr);
});

app.get('/api/buyhistory', (req, res) => {
    const buyhtr = JSON.parse(fs.readFileSync('./buyhistory.json', 'utf-8'));
    res.json(buyhtr);
});

app.get('/api/users', (req, res) => {
    try {
        const users = getUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/api/products/count', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync('./product.json', 'utf-8'));
        const totalProducts = products.length;
        res.json({ total: totalProducts });
    } catch (error) {
        console.error('Error fetching product count:', error);
        res.status(500).json({ message: 'Error fetching product count' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
