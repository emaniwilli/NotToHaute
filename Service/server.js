require('dotenv').config();

const app = require('./app');
const http = require('http');
const server = http.createServer(app)


app.listen(3000, () => console.log('Server Started'))

