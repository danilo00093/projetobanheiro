const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./database'); // Conexão com o banco de dados

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

// Status inicial do banheiro
let bathroomStatus = {
    occupied: false,
    user: '',
    userId: ''
};

// Rota de login
app.post('/login', (req, res) => {
    const { id, password } = req.body;

    db.get('SELECT * FROM users WHERE id = ? AND password = ?', [id, password], (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Erro no servidor.' });
        } else if (user) {
            res.json({ success: true, id: user.id });
        } else {
            res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }
    });
});

// WebSocket para sincronizar o status do banheiro
io.on('connection', (socket) => {
    // Envia o status inicial ao cliente
    socket.emit('statusUpdate', bathroomStatus);

    // Atualiza o status do banheiro
    socket.on('updateStatus', (data) => {
        if (
            (bathroomStatus.occupied && data.userId === bathroomStatus.userId) ||
            !bathroomStatus.occupied
        ) {
            bathroomStatus = data;
            io.emit('statusUpdate', bathroomStatus);
        } else {
            socket.emit('unauthorizedAction', 'Ação não autorizada.');
        }
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
