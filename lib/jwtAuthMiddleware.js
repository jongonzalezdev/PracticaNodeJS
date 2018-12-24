'use strict';

const jwt = require('jsonwebtoken');

// Función que devuelve un middleware de autenticación JWT

module.exports = () => {
    return (req, res, next) => {
        // recogemos el token del body, o del querystring o de la cabecera
        const token = req.body.token || req.query.token || req.get('x-access-token');

        if (!token) {
            const err = new Error(res.__('noToken'));
            err.status = 401;
            next(err);
            return;
        }

        // verificar el token
        jwt.verify(token, process.env.JWT_SECRET, (err, tokenDescodificado) => {
             if (err) {
                 next(new Error(res.__('invalidToken')));
                 return;
             }
             req.user_id = tokenDescodificado.user_id;
             next();
        });
    };
}