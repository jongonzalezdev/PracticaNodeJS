'use strict'

const mongoose = require('mongoose');

// Definir esquema para los anuncios
const anuncioSchema = mongoose.Schema({
    nombre: {type: String, index: true},
    venta: { type: Boolean, index: true},
    precio: { type: Number, index: true},
    foto: String,
    tags: { type: [String], index: true}
});

// Crear el modelo Anuncio con el esquema
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// Exportamos el modelo 
module.exports = Anuncio;