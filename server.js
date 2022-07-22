const express = require('express');
const mysql = require('mysql');
const BodyParser = require('body-parser');
const app = express();
const multer = require('multer');

app.use(BodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', 'views');

const upload = multer({ dest: 'uploads/' });
const db = mysql.createConnection({
  host: 'localhost',
  database: 'datamahasiswa',
  user: 'root',
  password: '',
});

db.connect((err) => {
  if (err) throw err;
  console.log('database connected...');

  app.get('/', (req, res) => {
    const sql = 'SELECT * FROM mahasiswa';
    db.query(sql, (err, result) => {
      const users = JSON.parse(JSON.stringify(result));
      res.render('index', {
        users: users,
        title: 'Data Mahasiswa',
      });
    });
  });

  app.post('/tambah', (req, res) => {
    const insertSql = `INSERT INTO mahasiswa (nama,jurusan) VALUES ('${req.body.nama}','${req.body.jurusan}')`;
    db.query(insertSql, (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
  });

  app.post('/hapus/:id', (req, res) => {
    const deleteSql = `DELETE FROM mahasiswa WHERE id = '${req.params.id}'`;
    db.query(deleteSql, (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
  });

  app.post('/edit/:id', (req, res) => {
    const user = `SELECT * FROM mahasiswa WHERE id = ${req.params.id}`;
    db.query(user, (err, result) => {
      const updateSql = `UPDATE mahasiswa SET nama = '${req.body.nama}', jurusan = '${req.body.jurusan}' WHERE id = '${req.params.id}'`;
      db.query(updateSql, (err, result) => {
        if (err) throw err;
        res.redirect('/');
      });
    });
  });

  app.get('/lihat/:id', (req, res) => {
    const getUser = `SELECT * FROM mahasiswa WHERE id = ${req.params.id}`;
    db.query(getUser, (err, result) => {
      if (err) throw err;
      const user = result[0];
      res.send(user.nama);
    });
  });
});

app.listen(8000, () => {
  console.log('ready');
});
