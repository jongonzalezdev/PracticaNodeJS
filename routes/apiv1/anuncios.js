'use strict';

const express = require('express');
const router = express.Router();

const Anuncio = require('../../models/Anuncio');
const jwtAuthMiddleware = require('../../lib/jwtAuthMiddleware');

// Es necesario estar auntenticado para ver los anuncios
router.use( jwtAuthMiddleware() );

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
         const nombre = req.query.nombre;
         const skip = parseInt(req.query.skip);
         const limit = parseInt(req.query.limit);
         const sort = req.query.sort;

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
             /*if (position === 0) { // el '-' está al inicio
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
             }*/
             if (position === -1) { // no se encuentra el caracter '-'
                //filter.precio = {$eq: precio};
                min = parseInt(precio) - 1;
                max = parseInt(precio) + 1;
                filter.precio = { $gt: min, $lt: max };
             } else {
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
         }

         if (nombre) {
             const regExpNombre = new RegExp('^' + nombre, 'i');
             filter.nombre = regExpNombre;
         }

         const query = Anuncio.find(filter);

         query.skip(skip);
         query.limit(limit);
         query.sort(sort);
         

         const anuncio = await query.exec();
         res.json({ success: true, message: res.__('ads'), result: anuncio });
     } catch(err) {
         next(err);
         return;
     }
 });

 /**
  * GET /anuncios/tags
  * Obtener la lista de los tags existentes en la db
  */

 router.get('/tags', async (req, res, next) => {
     try {
         // Busco los tags que tengo en la db
         const tags = await Anuncio.distinct('tags').exec();
         
         res.json({ success: true, message: res.__('tags'), result: tags });
     } catch(err) {
         if (err) {
             next(err);
             return;
         }
     }
 });

 module.exports = router;