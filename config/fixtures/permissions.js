// config/fixtures/permissions.js

var Promise = require('bluebird');


exports.create = function () {

var actions = ['read', 'create', 'delete', 'update'];
var modelosProfesor = ['Cuestionario', 'Pregunta', 'Opcion', 'Subopcion'];
var permisosProfesor = [];

actions.forEach(function(action){
	modelosProfesor.forEach(function(modeloProfesor){
		permiso = {role: 'profesor', model: modeloProfesor, action: action};
		if (action == 'delete') {permiso.relation = 'owner'};
		permisosProfesor.push(permiso);
	})
})
//sails.log.verbose(permisosProfesor);
	  return Promise.all([
	    Role.findOrCreate({ name: 'profesor' }, { name: 'profesor' }),
	    Role.findOrCreate({ name: 'alumno' }, { name: 'alumno' })
	  ]).then(function(role){
	  		return Promise.all([
			    PermissionService.grant(permisosProfesor), 
			    PermissionService.grant({ role: 'alumno', model: 'Cuestionario', action: 'read'}), 
			    PermissionService.grant({ role: 'alumno', model: 'Pregunta', action: 'read'})
		  ])
	  })
};
