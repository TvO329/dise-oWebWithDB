const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const iconv = require('iconv-lite');
const fs = require('fs');
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(__dirname + '/frontend/images'));

dotenv.config()

// Configuración de conexión a la base de datos MySQL
const db = () => mysql.createConnection({
  host: process.env.DB_HOST || 'localhost', // Debes reemplazar con la información de tu servidor MySQL
  user: process.env.DB_USER || 'root', // Debes reemplazar con tu nombre de usuario de MySQL
  password: process.env.DB_PASSWORD ||  'root', // Debes reemplazar con tu contraseña de MySQL
  database: process.env.DB_DATABASE || 'Campeon',
  port: process.env.DB_PORT || '3306'
});

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'frontend', 'main.html');
  const fileContents = iconv.encode(
    fs.readFileSync(filePath, 'utf-8'), // Lee el archivo con codificación UTF-8
    'win1252' // Codificación de Windows
  );
  res.end(fileContents);
});

// Resto de tu código...

app.post('/guardar-mejor-jugador', async (req, res) => {
  const {MejorJugador, mail, nombre, razon} = req.body;

  const sql = 'INSERT INTO MejorJugador (MejorJugador,  mail, nombre, razon) VALUES (?,?,?,?)';
  const values = [MejorJugador, mail, nombre, razon];
	
	const conn = db();

	const resSavePlayer = await new Promise(resolve => {
		conn.query(sql, values, (err, result) => {
			if (err) {
			  console.error('Error al insertar datos en MySQL:', err);
			  resolve(err.message);
			} else {
			  console.log('Mejor jugador insertado en MySQL:', MejorJugador);
			  resolve('Mejor jugador guardado en la base de datos MySQL');
			}
		});
	});
	
	   res.redirect('/')
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});