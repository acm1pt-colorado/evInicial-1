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
        enum: ['Ensayo', 'Emparejamiento','Numerica', 'VerdaderoFalso', 'EleccionMultiple'],
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

    aJSON: function(){
        Opcion.find({
            where: {pregunta: this.id}
        }).populate('subopciones').then(function(opciones){
            return opciones;
        });
    },

    comprobarRespuesta: function(respuesta, user, cuestionario, pregunta, cb){
        Alumno.findOne({
            where: {user: user}
        }).then(function(alumno){
            if(alumno){
                switch(this.tipo){
                //ELECCION MULTIPLE
                case "EleccionMultiple":
                    this.comprobarEleccionMultiple(respuesta, function (err, puntuacion, texto){
                        if(!err){
                            Respuesta.create({valor: texto, puntuacion: puntuacion, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                            .exec(function createCB(err, created){
                                //sails.log.verbose(created);
                                cb(err,created);
                            })
                        }else{
                            cb(err, null);
                        }
                    });
                    break;
                //VERDADERO/FALSO
                case "VerdaderoFalso":
                    this.comprobarTrueFalse(respuesta, function (err, puntuacion, texto){
                        Respuesta.create({valor: texto, puntuacion: puntuacion, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                        .exec(function createCB(err, created){
                            //sails.log.verbose(err);
                            cb(err,created);
                        })
                    });
                    break;
                //Numerica
                case "Numerica":
                    this.comprobarNumerica(respuesta, function (err,puntuacion, texto){
                        if(!err){
                            Respuesta.create({valor: texto, puntuacion: puntuacion, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                            .exec(function createCB(err, created){
                                //sails.log.verbose(created);
                                cb(err,created);
                            })
                        }else{
                            cb(err, null);
                        }
                    });
                    break;
                //Emparejamiento/Matching
                case "Emparejamiento":
                    this.comprobarEmparejamiento(respuesta, function (err,puntuacion, texto){
                        Respuesta.create({valor: texto, puntuacion: puntuacion, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                        .exec(function createCB(err, created){
                            //sails.log.verbose(err);
                            cb(err,created);
                        })
                    });
                    break;
                case "Ensayo":
                    this.comprobarEnsayo(respuesta, function (texto){
                        Respuesta.create({valor: texto, puntuacion: null, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                        .exec(function createCB(err, created){
                            //sails.log.verbose(err);
                            cb(err,created);
                        })
                    });
                    break;
            }
                
            }else{
                sails.log.verbose("No estas autenticado como usuario Alumno");
            }
        }.bind(this))

    },
    // FUNCION ELECCION MULTIPLE 
        comprobarEleccionMultiple: function(respuesta, cb){
            this.comprobarOpcion(respuesta, function(opcion){
                if(opcion) {
                    Subopcion.findOne({
                        where: {opcion: Number(opcion.id), nombre: "fraccion"}
                    }).then(function(subopcion){
                        var puntuacion = subopcion.valor;
                        Subopcion.findOne({
                            where: {opcion: Number(opcion.id), nombre: "text"}
                        }).then(function(subopcion){
                            var texto = subopcion.valor;
                            cb(null,puntuacion, texto);
                        })
                    })
                }
                else {
                    cb(new Error('No coincide la opcion con la pregunta'), null,null);
                }
            });
        },


        //FUNCION TRUE-FALSE
        comprobarTrueFalse: function(respuesta, cb) {
            var puntos = 0;
            var valorRespuesta = 0;
            Opcion.findOne({
                where: { id: Number(respuesta)}
            }).populate('subopciones').then(function(misOpciones){
                /*sails.log.verbose(misOpciones.subopcions[0]);*/
                misOpciones.subopciones.forEach(function(subopcion){
                    sails.log.verbose(subopcion);
                    if(subopcion.nombre === 'fraccion'){
                        puntos = subopcion.valor;
                    }
                    if(subopcion.nombre === 'text'){
                        valorRespuesta = subopcion.valor;
                    }

                    });
                    cb(err,puntos, valorRespuesta);
                })
        },

        //FUNCION NUMERICA
        comprobarNumerica: function(respuesta, cb) {
            var guardavalor1;
            var guardavalor2;
            Opcion.findOne({
                where: { id: Number(respuestaRec) }
            }).populate('subopciones').then(function(opcion){
                    //console.log(opcion.subopciones); 
                opcion.subopciones.forEach(function(subopcion){
                    //De opcion entro a subopciones y con el forEach recorro en subopciones una subopcion
                    if(subopcion.nombre=='fraccion'){
                        guardavalor1=subopcion.valor; //guardo el valor de fraccion
                        //sails.log.verbose(guardavalor1);
                    }
                    if(subopcion.nombre=='text'){
                        guardavalor2=subopcion.valor; //guardo el valor de texto
                        //sails.log.verbose(guardavalor2);
                    }
                })

                cb(err,guardavalor1, guardavalor2);

            })
        },

        //EMPAREJAMIENTO
        comprobarEmparejamiento: function(respuesta, cb) {
            respuesta.split("$$");
            Incremento = 0;
            Puntos = 0;

            // Cliente envia ID de la 'subquestion' y el ID de la subopcion 'answer'.
            Opcion.find().where({ pregunta: this.id, tipoOpcion: 'subquestion' }).populate('subopciones')
                .then(function(opciones){
                    Puntos = 0;
                    Incremento = Math.floor(100 / opciones.length);

                    for ( i = 0 ; i < respuesta.length ; i += 2 ) {
                        for ( n = 0 ; n < opciones.length ; n++ ) {
                            if ( respuesta[i] == opciones[n].subopciones[0].valor && 
                                 respuesta[i+1] == opciones[n].subopciones[1].valor ) {
                                
                                Puntos += Incremento;
                            }
                        }
                    }
                     cb(err,Puntos, respuesta);
            })
            .catch(function(error){
                console.log(error);
            });
        },

        //ENSAYO
        comprobarEnsayo: function(respuesta, cb) {
            cb(respuesta);
        },

        comprobarOpcion: function(respuesta, cb) {
            Opcion.findOne({
                where: { id: respuesta, pregunta: Number(this.id) }
            }).then(function(opcion){
                sails.log.verbose(opcion);
                cb(opcion);
            })
            ;
        }
    }
};


