'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Usuario = require('../../models/Usuario');

/**
 * POST /usuarios/registro
 * Crea un nuevo usuario en la base de datos
 */

 router.post('/registro', async (req, res, next) => {
     try {
         // recogemos los datos del nuevo usuario
         const userData = req.body;

         // Compruebo que el email introducido no exista
         const existe = await Usuario.findOne({ email: userData.email}).exec();
         if (existe) {
             res.json({ success: false, error: 'Usuario ya registrado' });
             return;
         }

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

 /**
  * POST /usuarios/login
  * Login para los usuarios
  */

  router.post('/login', async (req, res, next) => {
         try {
             // Recojo los datos del usuario que quiere logear
             const email = req.body.email;
             const clave = req.body.clave;

             // Busco el usuario en la db
             const usuario = await Usuario.findOne({ email: email}).exec();

             // Compruebo que haya encontrado algún resultado
             if (!usuario) {
                 res.json({ success: false, error: 'Credenciales invalidas'});
                 return;
             }

             // Si ha encontrado un resultado, compruebo que la clave sea correcta
             if (usuario.clave !== clave) {
                 res.json({ success: false, error: 'Credenciales invalidas'});
                 return;
             }

             // En caso de encontrar resultado y de que la clave coincida, se crea un token
             jwt.sign({ user_id: usuario._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE }, (err, token) => {
                 if (err) {
                     next(err);
                     return;
                 }
                 res.json({ success: true, result: token });
             });
         } catch(err) {
             if (err) {
                 next(err);
                 return;
             }
         }
  });

module.exports = router;