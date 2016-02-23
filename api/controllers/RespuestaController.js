/**
 * RespuestaController
 *
 * @description :: Server-side logic for managing respuestas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	respuesta: function(req, res, next){
		req.pregunta.comprobarRespuesta(req.body.answered, req.session.passport.user, req.cuestionario.id, req.pregunta.id, res);
	}
};

