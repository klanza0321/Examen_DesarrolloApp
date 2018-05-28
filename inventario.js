

//Require de las librerias a utilizar
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.listen(3000, function () {
    console.log('App escuchando en el puerto 3000!');
  });

app.use(bodyParser.urlencoded({ extended: true }));


//En el mongoose 5.x ya no es necesario el uso de "useMongoClient" por eso lo dejo comentado.
mongoose.connect('mongodb://admin_kevin:admin@ds137720.mlab.com:37720/examen_invetario'/*{useMongoClient: true}*/, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

var inventarioSchema = mongoose.Schema({
    _id: Number,
    Descripcion: String,
    Marca: String,
    NumeroEstante: String,
    Fecha: {type: Date, default:Date.now} 
});

inventarioSchema.methods.info = function (){};
var Inventario = mongoose.model('Inventario', inventarioSchema);

//Metodo post para agregar un nuevo producto
app.post('/api/productos',function(req,res){
    var nuevo_producto = new Inventario({
        _id: req.body.id,
        Descripcion: req.body.Descripcion,
        Marca: req.body.Marca,
        NumeroEstante: req.body.NumeroEstante,
    
    });

    nuevo_producto.save(function (error, nuevo_producto) {
        if (error) {
            console.log(error);
            res.status(500).send('No se ha podido agregar.');
        }
        else {
            res.status(200).json('Agregado exitosamente'); 
        }
    });
});

//Muestra toda la lista de productos
app.get('/api/productos',function (req, res){
    Inventario.find(function (err, productos) {
        if (err) {
            console.log(err);
            res.status(500).send('Error en la base de datos');
        }
        else
            res.status(200).json(productos);
    });
});

//Muestra la busqueda de un producto por ID
app.get('/api/productos/:id',function (req, res){
    Inventario.findById(req.params.id,function (err, productos) {
        if (err) {
            console.log(err);
            res.status(500).send('Error en la base de datos');
        }
        else
            res.status(200).json(productos);
    });
});

//Query para buscar productos por su Marca
/*app.get('/api/productos',function (req, res){
    Inventario.find({Marca: req.query.Marca}, function (err, productos) {
        if (err) {
            console.log(err);
            res.status(500).send('Error al leer de la base de datos');
        }
        else
            res.status(200).json(productos);
    });
});*/


//Query para buscar productos por su fecha
/*app.get('/api/productos',function (req, res){
    Inventario.find({fechadesde: {$gte: req.query.Fecha},fechahasta: {$lte: req.query.Fecha}},function (err, productos) {
        if (err) {
            console.log(err);
            res.status(500).send('Error en la base de datos');
        }
        else
            res.status(200).json(productos);
    });
});*/


//DELETE para eliminar un producto 
app.delete('/api/productos/:id',function(req,res){
    Inventario.findById(req.params.id,function(err, productos) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else{
            if (productos != null) {
                productos.remove(function (error, result) {
                    if (error)
                        res.status(500).send('Error en la base de datos');
                    else {
                        res.status(200).send('Eliminado exitosamente');
                    }
                });
            }
            else
                res.status(404).send('No se encontro ese producto');
        }
    });
});