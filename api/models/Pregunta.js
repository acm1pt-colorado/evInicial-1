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

    comprobarRespuesta: function(respuesta){
        switch(this.tipo){
            //ELECCION MULTIPLE
            case: "EleccionMultiple":
                comprobarEleccionMultiple: function(respuesta){
                        Subopcion.findOne({
                            where: {opcion: Number(respuesta), nombre: "fraccion"}
                        }).then(function(subopcion){
                            var puntuacion = subopcion.valor;
                            var alumno = req.session;
                            Subopcion.findOne({
                                where: {opcion: Number(respuesta), nombre: "text"}
                            }).then(function(subopcion){
                            Alumno.findOne({
                                where: {user: alumno.passport.user}
                            }).then(function(alumno){
                                if(alumno){
                                    Respuesta.create({valor: subopcion.valor, puntuacion: puntuacion, alumno: alumno.id})
                                    .exec(function createCB(err, created){
                                        sails.log.verbose('Created respuesta : Valor: ' + created.valor +" Puntuacion : "+ created.puntuacion);
                                    })
                                }else{
                                    sails.log.verbose("No estas autenticado como usuario Alumno");
                                }
                            })
                        })  
                    })
                }
                break;
            // NUMERICA
            case: "Numerica":
                comprobarNumerica: function(respuesta){

                }
                break;
            //VERDADERO/FALSO
            case: "Verdadero/Falso":
                comprobarVerdaderoFalso: function(respuesta){

                }
                break;
            case: "Emparejamiento":
                comprobarEmparejamiento: function(respuesta){
                    
                }
                break;
            case: "Ensayo":
                comprobarEnsayo: function(respuesta){
                    
                }
                break;
        }
    }

  }
};


