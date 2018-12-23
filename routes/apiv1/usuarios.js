'use strict';

const express = require('express');
const router = express.Router();

const Usuario = require('../../models/Usuario');

/**
 * POST /usuarios/registro
 * Crea un nuevo usuario en la base de datos
 */

 router.post('/registro', async (req, res, next) => {
     try {
         // recogemos los datos del nuevo usuario
         const userData = req.body;

         // Creo un nuevo usuario, objeto de tipo Usuario
         const user = new Usuario(userData);

         // Guardo el usuario creado en la base de datos
         await user.save();

         res.json({ success: true, result: user });

     } catch(err) {
         next(err);
         return;
     }
 });

module.exports = router;