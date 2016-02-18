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
				var alumno = req.session;
				Alumno.findOne({
					where: {user: alumno.passport.id}
				}).then(function(alumno){
					if(alumno){
						Respuesta.create({valor: respuesta, puntuacion: puntuacion, alumno: alumno.id})
						.exec(function createCB(err, created){
							res.send('Created respuesta : Valor: ' + created.valor +" Puntuacion : "+ created.puntuacion);
						})
					}else{
						res.send("No estas autenticado como usuario alumno");
					}
				})


				
				
			})
	}
};

