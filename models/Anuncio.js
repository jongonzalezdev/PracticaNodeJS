'use strict'

const mongoose = require('mongoose');

// Definir esquema para los anuncios
const anuncioSchema = mongoose.Schema({
    nombre: {type: String, index: true},
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

// Crear el modelo Anuncio con el esquema
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// Exportamos el modelo 
module.exports = Anuncio;