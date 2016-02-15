/**
* Opcion.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	pregunta:{
  		model:'pregunta'
  	},
  	tipoOpcion:{
  		type:'string',
  		size:45
  	},

  	subopciones:{
  		collection:'subopcion',
  		via:'opcion'
  	}
  }
};

