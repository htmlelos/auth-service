"user strict";
const Profile = require('../models/profile')

//Get all the profiles
//Obtener todos los perfiles
function getProfiles(request, response) {
	Profile.find({})
		.then(profile => {
			response.send(profile)
			response.end()
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}
//Create a new profile
//Crea un nuevo perfil
function postProfile(request, response) {
	// Create a profile instance with the parameters
	let newProfile = new Profile(request.body)

	newProfile.save()
		.then(profile => {
			response.json({ message: 'Perfil creado con exito' })
			response.end()
		})
		.catch(error => {
			let message = ''
			if(error.code === 11000) {
				message = 'El perfil ya existe'
			} else {
				for(let property in error.errors) {
					if(error.errors.hasOwnProperty(property)) {
						message += error.errors[property].message + '<br>'
					}
				}
			}
			response.status(422).send({ message: message.replace(/(^,)|(,$)/g, "") })
			response.end()
		})
}
// Get a profile
// Obtener un perfil
function findProfile(profileId) {
	return Profile.findById({ _id: profileId })
}
// Get a profile by its profileId
// Obtener un perfil por su profileId
function getProfile(request, response) {
	findProfile(request.params.profileId)
		.then(profile => {
			if(profile) {
				response.json({ message: 'Perfil obtenido con exito', profile })
			} else {
				response.status(404).json({ message: 'No se encontro el perfil', profile })
			}
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}
//Assign the new data to the profile
//Asigna el nuevo dato al rol
function assignProfile(oldValue, newValue) {
	return Object.assign(oldValue, newValue).save()
}
//Update a profile by its profileId
//Actualiza un rol por su profileId
function updateProfile(request, response) {
	findProfile(request.params.profileId)
		.then(profile => {
			if(profile) {
				assignProfile(profile, request.body)
					.then(profile => {
						response.json({ message: 'Perfil actualizado con exito', profile })
					})
					.catch(error => {
						if(error.code === 11000) {
							response.status(422).send({ message: 'El perfil ya existe' })
						} else {
							response.send(error)
							response.end()
						}
					})
			} else {
				response.status(404)
					.send({ message: 'El perfil, no es un perfil valido' })
			}
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}

function deleteProfile(request, response) {
	findProfile(request.params.profileId)
		.then(profile => {
			if(profile) {
				Profile.remove({ _id: profile.id })
					.then(profile => {
						response.json({ message: 'Perfil eliminado con exito' })
					})
					.catch(error => {
						response.send(error)
						response.end()
					})
			} else {
				response.status(404).json({ message: 'El perfil, no es un perfil valido' })
			}
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}

module.exports = {
	getProfiles,
	postProfile,
	getProfile,
	updateProfile,
	deleteProfile
}
