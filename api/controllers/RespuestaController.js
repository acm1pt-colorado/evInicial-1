/**
 * RespuestaController
 *
 * @description :: Server-side logic for managing respuestas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	respuesta: function(req, res, next){
		var respuesta = req.body.answered;
		Subopcion.findOne({
				where: {opcion: Number(respuesta), nombre: "fraccion"}
			}).then(function(subopcion){
				var puntuacion = subopcion.valor;
				Respuesta.create({valor: respuesta, puntuacion: puntuacion})
				.exec(function createCB(err, created){
					res.send('Created respuesta : Valor: ' + created.valor +" Puntuacion : "+ created.puntuacion);
				})
			})
	}
};

