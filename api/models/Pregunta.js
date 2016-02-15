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

    }
  };


