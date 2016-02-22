/**
* Pregunta.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    enunciado : {
    	type: 'string',
    	size: 45,
    	required: true
	},

    tipo : { 
        type: 'string',
        enum: ['Ensayo', 'Emparejamiento','Numerica', 'Verdadeo/Falso', 'EleccionMultiple'],
    	size: 255,
    	required: true
    },

    cuestionarios : {
        collection : 'cuestionario',
        via : 'preguntas'
    },

    opciones:{
        collection:'opcion',
        via:'pregunta'
    },

    respuestas:{
        collection:'respuesta',
        via:'pregunta'
    },

    getPregunta: function(){
        return this.toJSON();
    },

    comprobarRespuesta: function(respuesta, user, cuestionario, pregunta){
        switch(this.tipo){
            //ELECCION MULTIPLE
            case "EleccionMultiple":
                this.comprobarEleccionMultiple(respuesta, function cb(){
                    Alumno.findOne({
                        where: {user: user}
                    }).then(function(alumno){
                        if(alumno){
                            Respuesta.create({valor: "Correcto", puntuacion: 100, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                            .exec(function createCB(err, created){
                                res.json(created);
                            })
                        }else{
                            sails.log.verbose("No estas autenticado como usuario Alumno");
                        }
                    })
                });
                break;
            // NUMERICA
            case "Numerica":
                
                break;
            //VERDADERO/FALSO
            case "Verdadero/Falso":
                
                break;
            case "Emparejamiento":
                
                break;
            case "Ensayo":
                
                break;
        }

    },

        comprobarEleccionMultiple: function(respuesta, cb){
            Subopcion.findOne({
                where: {opcion: Number(respuesta), nombre: "fraccion"}
            }).then(function(subopcion){
                var puntuacion = subopcion.valor;
                Subopcion.findOne({
                    where: {opcion: Number(respuesta), nombre: "text"}
                }).then(function(subopcion){
                    var texto = subopcion.valor;
                    return cb(puntuacion, texto);
                })  
            })
        },
    
  }
};


