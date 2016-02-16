/**
 * RespuestaController
 *
 * @description :: Server-side logic for managing respuestas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	respuesta: function(req, res, next){
		var respuesta = req.body.answered;
		Opcion.find({
			pregunta:req.pregunta.id
		}).populate('subopciones').then(function(opciones){
			opciones.forEach(function(opcion){
				opcion.forEach(function(subopciones)){
					
				}
			})
		})
		
	}
};

