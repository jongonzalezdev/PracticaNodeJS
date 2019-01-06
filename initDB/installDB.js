'use strict';

const bcrypt = require('bcrypt');
const fs = require("fs");

const Usuario = require('../models/Usuario');
const Anuncio = require('../models/Anuncio');


inicializaDB();

function inicializaDB(){
    try {
        // Conectamos con la base de datos
        const conn = require('../lib/connectMongoose');

        // Elimino la colección de anuncios y usuarios
        conn.dropCollection('anuncios');
        conn.dropCollection('usuarios');


        let datosIniciales;

        // llamamos a la función que nos leerá el fichero
        leerFichero(function(error, datosJson){
            if (error) {
                console.log('Ha ocurrido un error al leer el fichero', error);
                return;
            }
            datosIniciales = datosJson;

            // Tras leer el fichero y parsearlo llamamos a la función que nos precargará la DB
            insertarDatos(datosIniciales, function(error) {
                if (error) {
                    console.log('Ha ocurrido un error al insertar datos en la DB', error);
                    return;
                }

                console.log('Base de datos inicializada');
                conn.close();
            });
        });

    } catch(err) {
        console.log('Error al inicializar la base de datos', err);
    }
}


/**
 * Función que leer el fichero con los datos iniciales y lo parsear a objeto
 * @param {Function} callback 
 */
function leerFichero(callback) {
    // Leemos el contenido del fichero data.json que contiene los anuncios y el usuario para precargar la base de datos

    const fichero = './initDB/data.json';

    fs.readFile(fichero, function(err, datos) {
        if (err) {
            callback(err);
            return;
        }

        let datosJson;

        try {
            // parsear datos y convertir en objeto
            datosJson = JSON.parse(datos);
        }catch(err) {
            callback(new Error(`No se pudo parsear el contenido de ${fichero}`));
            return;
        }

        // devolvemos el objeto con los datos iniciales en el callback
        callback(null, datosJson);
    });
};

/**
 * Función que nos insertará en la DB documentos desde un objeto
 * @param {object} datos 
 * @param {Function} callback 
 */

function insertarDatos(datos, callback) {

    // Uso bcrypt para hashear la constraseña del usuario de prueba que se añade a la base de datos
    const saltRounds = 10;

    bcrypt.hash(datos.usuarios.clave, saltRounds).then(async (hash) => {
        datos.usuarios.clave = hash;

        await Usuario.insertMany(datos.usuarios, function(err) {
            if (err) {
                callback(new Error('Error al insertar usuarios'));
                return;
            }
    
            Anuncio.insertMany(datos.anuncios, function(err) {
                if (err) {
                    callback(new Error('Error al insertar anuncios'));
                    return;
                }
    
                // Una vez insertados los usuarios y anuncios devolvemos el callback sin ningún error
                callback(null);
            });
        });
    });
    
};