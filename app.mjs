process.loadEnvFile()

import express from 'express'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import { query, validationResult } from 'express-validator'
import { consultarCC } from './sisben.mjs'

const app = express()
const port = process.env.server_port || 3000

const allowed_origins = ['*']

app.use(cors({
    methods: ['GET'],
    origin: (origin, callback) => {
        if ((!origin || !allowed_origins.includes(origin)) && !allowed_origins.includes('*')) return callback('sin autorización', false)

        callback(null, true)
    },
}))

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 150,
    message: 'Demasiadas peticiones, espera un momento.'
})

app.use(limiter)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const validations = [
    query('CC').notEmpty().withMessage('El documento es obligatorio.').bail()
        .isNumeric().withMessage('Debes de poner un documento válido.').bail()
        .escape()
]

const handlingErrors = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.mapped() })
    }

    next()
}

app.get('/', validations, handlingErrors, async (req, res) => {
    const { CC } = req.query

    const consultaSisben = await consultarCC(CC)

    res.status(consultaSisben.error ? 404 : 200).send({ ...consultaSisben })
})

app.listen(port, () => {
    console.log('Servidor corriendo en el puerto 3000')
})