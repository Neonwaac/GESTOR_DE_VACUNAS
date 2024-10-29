const express = require ("express");
const mysql = require("mysql");
const cors = require("cors");
const {json} = require("express");

const app = express();
app.use(cors())
app.use(express.json())

const port = 8007;
app.listen(port, function(){
    console.log("Server is running on port "+port)
})

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestiondevacunas'
})

db.connect(function(err){
    if(err){
        throw err;
        db.end()
    }else{
        console.log("Connected to database")
    }
})
//PARA MASCOTA
app.get("/mascota", function(req, res){
    db.query("SELECT * FROM mascota", function(err, rows){
        if(err) throw err;
        res.send(rows);
    });
});

app.get("/mascota/:id", function(req, res) {
    const { id } = req.params;
    db.query("SELECT * FROM mascota WHERE id = ?", [id], function(err, row) {
        if (err) throw err;
        res.send(row);
    });
});

app.post("/mascota", function(req, res){
    const { nombre, animal, edad } = req.body;
    const query = "INSERT INTO mascota (nombre, animal, edad) VALUES (?, ?, ?)";
    db.query(query, [nombre, animal, edad], function(err, rows){
        if(err) throw err;
        res.send("Añadido:" + rows);
    });
});

app.put("/mascota/:id", function(req, res){
    const { id } = req.params;
    const { nombre, animal, edad } = req.body;
    const query = "UPDATE mascota SET nombre = ?, animal = ?, edad = ? WHERE id = ?";
    db.query(query, [nombre, animal, edad, id], function(err, rows){
        if(err) throw err;
        res.send("Actualizado: " + rows);
    });
});

app.delete("/mascota/:id", function(req, res){
    const { id } = req.params;
    const query = "DELETE FROM mascota WHERE id = ?";
    db.query(query, [id], function(err, rows){
        if(err) throw err;
        res.send("Eliminado: " + rows);
    });
});
//PARA VACUNAS
app.get("/vacuna", function(req, res) {
    db.query("SELECT * FROM vacuna", function(err, rows) {
        if (err) throw err;
        res.send(rows);
    });
});
app.get("/vacuna/:id", function(req, res) {
    const { id } = req.params;
    db.query("SELECT * FROM vacuna WHERE id = ?", [id], function(err, row) {
        if (err) throw err;
        res.send(row);
    });
});
//PARA HISTORIAL
app.get("/historial", function(req, res) {
    db.query("SELECT * FROM historial", function(err, rows) {
        if (err) throw err;
        res.send(rows);
    });
});

app.get("/historial/:id", function(req, res) {
    const { id } = req.params;
    db.query("SELECT * FROM historial WHERE id = ?", [id], function(err, row) {
        if (err) throw err;
        res.send(row);
    });
});
app.put("/historial/:id", function(req, res) {
    const { id } = req.params;
    const { fecha } = req.body;
    const query = "UPDATE historial SET fecha = ? WHERE id = ?";
    db.query(query, [fecha, id], function(err, result) {
        if (err) throw err;
        res.send("Historial actualizado");
    });
});

app.get("/mascota/:id/historial", function(req, res) {
    const { id } = req.params;
    db.query("SELECT * FROM historial WHERE id_mascota = ?", [id], function(err, rows) {
        if (err) throw err;
        res.send(rows);
    });
});

app.delete("/historial/:id", function(req, res) {
    const { id } = req.params;
    const query = "DELETE FROM historial WHERE id = ?";
    db.query(query, [id], function(err, result) {
        if (err) throw err;
        res.send("Historial eliminado");
    });
});

app.post("/historial", function(req, res) {
    const { id } = req.params;
    const { id_mascota,id_vacuna, fecha } = req.body;
    const query = "INSERT INTO historial (id,id_mascota, id_vacuna, fecha) VALUES (?, ?, ?, ?)";
    db.query(query, [id, id_mascota, id_vacuna, fecha], function(err, result) {
        if (err) throw err;
        res.send("Historial agregado");
    });
});