const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./students.db');

app.use(express.json());
app.use(express.static('public'));

// Création de la table au démarrage
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, grade TEXT)");
});

// API : Récupérer les étudiants
app.get('/api/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        res.json(rows);
    });
});

// API : Ajouter un étudiant
app.post('/api/students', (req, res) => {
    const { name, age, grade } = req.body;
    
    // Validation simple
    if (!name || !age || age <= 0) {
        return res.status(400).json({ error: "Données invalides !" });
    }

    db.run("INSERT INTO students (name, age, grade) VALUES (?, ?, ?)", [name, age, grade], function(err) {
        res.json({ id: this.lastID });
    });
});
app.delete('/api/students/:id', (req, res) => {
    db.run("DELETE FROM students WHERE id = ?", req.params.id, (err) => {
        res.json({ success: true });
    });
});
app.put('/api/students/:id', (req, res) => {
    const { name, age, grade } = req.body;
    db.run("UPDATE students SET name = ?, age = ?, grade = ? WHERE id = ?", 
    [name, age, grade, req.params.id], () => {
        res.json({ success: true });
    });
});
app.listen(3000, () => {
    console.log('🚀 Serveur lancé sur http://localhost:3000');
});