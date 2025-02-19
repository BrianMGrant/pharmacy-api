const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	image: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: (v) =>
				/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
					v
				),
			message: (props) => `${props.value} is not a valid email address!`,
		},
	},
	phoneNumber: {
		type: String,
		required: true,
		validate: {
			validator: (v) => /\d{3}-\d{3}-\d{4}/.test(v),
			message: (props) => `${props.value} is not a valid phone number!`,
		},
	},
	password: { type: String, required: true },
	role: {
		type: String,
		enum: ['customer', 'doctor', 'admin'],
		required: true,
		default: 'customer',
	},
})

UserSchema.pre('save', async function (next) {
	if (this.password && this.isModified('password')) {
		const salt = await bcrypt.genSalt(10).catch((error) => console.log(error))

		const hashedPassword = await bcrypt
			.hash(this.password, salt)
			.catch((error) => console.log(error))

		this.password = hashedPassword

		next()
	} else {
		throw new Error('fatal error while running `users` pre save model middleware')
	}
})

module.exports = mongoose.model('users', UserSchema)
