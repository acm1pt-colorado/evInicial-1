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

    comprobarRespuesta: function(respuesta, user, cuestionario, pregunta, cb){
        Alumno.findOne({
            where: {user: user}
        }).then(function(alumno){
            if(alumno){
                switch(this.tipo){
                //ELECCION MULTIPLE
                case "EleccionMultiple":
                    this.comprobarEleccionMultiple(respuesta, function cb(puntuacion, texto){
                        Respuesta.create({valor: texto, puntuacion: puntuacion, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                        .exec(function createCB(err, created){
                            sails.log.verbose(err);
                            sails.log.verbose(created, puntuacion, texto);
                            cb(created);
                        })
                    });
                    break;
                //VERDADERO/FALSO
                case "VerdaderoFalso":
                    this.comprobarTrueFalse(respuesta, function cb(puntuacion, texto){
                        Respuesta.create({valor: texto, puntuacion: puntuacion, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                        .exec(function createCB(err, created){
                            //sails.log.verbose(err);
                            return created;
                        })
                    });
                    break;
                //Numerica
                case "Numerica":
                    this.comprobarNumerica(respuesta, function cb(puntuacion, texto){
                        Respuesta.create({valor: texto, puntuacion: puntuacion, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                        .exec(function createCB(err, created){
                            //sails.log.verbose(err);
                            return created;
                        })
                    });
                    break;
                //Emparejamiento/Matching
                case "Emparejamiento":
                    this.comprobarEmparejamiento(respuesta, function cb(puntuacion, texto){
                        Respuesta.create({valor: texto, puntuacion: puntuacion, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                        .exec(function createCB(err, created){
                            //sails.log.verbose(err);
                            return created;
                        })
                    });
                    break;
                case "Ensayo":
                    this.comprobarEnsayo(respuesta, function cb(puntuacion, texto){
                        Respuesta.create({valor: texto, puntuacion: puntuacion, cuestionario: cuestionario, pregunta: pregunta, alumno: alumno.id})
                        .exec(function createCB(err, created){
                            sails.log.verbose(err);
                            return created;
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
            Subopcion.findOne({
                where: {opcion: Number(respuesta), nombre: "fraccion"}
            }).then(function(subopcion){
                var puntuacion = subopcion.valor;
                Subopcion.findOne({
                    where: {opcion: Number(respuesta), nombre: "text"}
                }).then(function(subopcion){
                    var texto = subopcion.valor;
                    cb(puntuacion, texto);
                })  
            })
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
                        puntos= subopcion.valor;
                    }
                    if(subopcion.nombre === 'text'){
                        valorRespuesta= subopcion.valor;
                    }

                    });
                    cb(puntos, valorRespuesta);
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

                cb(guardavalor1, guardavalor2);

            })
        },

        //EMPAREJAMIENTO
        coprobarEmparejamiento: function(respuesta, cb) {
            Incremento = 0;
            Puntos = 0;


            // Cliente envia ID de la 'subquestion' y el ID de la subopcion 'answer'.

            Opcion.find().where({ pregunta: req.pregunta.id, tipoOpcion: 'subquestion' }).populate('subopciones')
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
            })
                cb(Puntos, respuesta);
        },

        //ENSAYO
        comprobarEnsayo: function(respuesta, cb) {
            var valor1;
            var valor2;
            Opcion.findOne({
                where: { id: Number(respuesta) }
            }).populate('subopciones').then(function(opcion){
                    

                opcion.subopciones.forEach(function(subopcion){
                    
                    if(subopcion.nombre=='fraccion'){
                        valor1=subopcion.valor; 
                        
                    }
                    if(subopcion.nombre=='text'){
                        valor2=subopcion.valor; 
                        
                    }
                    });

                cb(valor1, valor2);
            })
        }
    }
};


