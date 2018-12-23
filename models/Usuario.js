'use strict';

const mongoose = require('mongoose');

// Definir esquema para los usuarios
const usuarioSchema = mongoose.Schema({
    nombre: String,
    email: { type: String, index: true },
    clave: String
});

// Crear el modelo Usuario con el esquema
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Exportamos el modelo
module.exports = Usuario;