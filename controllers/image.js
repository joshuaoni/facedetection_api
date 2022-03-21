const clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '516a98ae88a24fd1ae1c6eade76c6f21'
})

const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Face detect model currently down'))
}

const handleImage = (req, res, db) => {
    const {id} = req.body;
    db('users')
    .where({
        id: id
    })
    .increment('entries', 1)
    .returning('*')
    .then(user => {
        if (user[0].entries > 2) {
            db.select('*').from('users')
            .where({
                id: id
            })
            .update({
                max: true
            })
            .returning('*')
            .then(user => {
                res.json(user[0])
            })
        } else {
            res.json(user[0])
        }
    })
    .catch(err => res.status(400).json('An error occured'))
}

module.exports = {
    handleImage,
    handleApiCall
}