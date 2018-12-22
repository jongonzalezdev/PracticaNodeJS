'use strict';

const express = require('express');
const router = express.Router();

const Anuncio = require('../../models/Anuncio');

/**
 * GET /anuncios
 * Obtenemos una lista de anuncios
 */

 router.get('/', async (req, res, next) => {
     try {
         // datos de entrada para los filtros
         const tag = req.query.tag;
         const venta = req.query.venta;
         const precio = req.query.precio;
         const nombre = new RegExp('^' + req.query.nombre, 'i');

         const filter = {};

         // Búsqueda por tag
         if (tag) {
             filter.tags = tag;
         }

         // Búsqueda por venta o no
         if (venta) {
             filter.venta = venta;
         }

         // Búsqueda por rango de precio
         if (precio) {

             // calculo la posición del caracter '-' en el string del precio
             const position = precio.indexOf('-');

             var min;
             var max;

             // Dependiendo de la posición del '-' realizamos la búsqueda en un rango
             if (position === 0) { // el '-' está al inicio
                 max = parseInt(precio.substr(1, precio.length - 1));
                 filter.precio = { $lt: max };
             } else {
                 if (position === precio.length -1) { // El '-' está al final
                     min = parseInt(precio.substr(0, position));
                     filter.precio = { $gt: min };
                 } else { // El '-' está en el medio
                     min = parseInt(precio.substr(0, position));
                     max = parseInt(precio.substr(position + 1));
                     filter.precio = { $gt: min, $lt: max };
                 }
             }
         }

         if (nombre) {
             filter.nombre = nombre;
         }

         const query = Anuncio.find(filter)

         const anuncio = await query.exec();
         res.json({ success: true, resutl: anuncio });
     } catch(err) {
         next(err);
         return;
     }
 });

 module.exports = router;