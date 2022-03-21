const handleSignin = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body;
    
    db.select('email', 'hash').from('login')
    .where({
        email: email.toLowerCase().trim()
    })
    .then(data => {
        const passwordValid = bcrypt.compareSync(password, data[0].hash); 
        if (passwordValid) {
            db.select('*').from('users')
            .where({
                email: email.toLowerCase().trim()
            })
            .update({
                now: new Date()
            })
            .returning('*')
            .then(user => {
                const {compare, now, entries} = user[0]
                if (compare.getDate() !== now.getDate()) {
                    db.select('*').from('users')
                    .where({
                        email: email.toLowerCase().trim()
                    })
                    .update({
                        compare: new Date(),
                        entries: 0,
                        max: false
                    })
                    .returning('*')
                    .then(user => res.json(user[0]))              
                } else if (compare.getDate() === now.getDate() && entries < 3) {
                    db.select('*').from('users')
                    .where({
                        email: email.toLowerCase().trim()
                    })
                    .update({
                        max: false
                    })
                    .returning('*')
                    .then(user => res.json(user[0]))
                } else {
                    db.select('*').from('users')
                    .where({
                        email: email.toLowerCase().trim()
                    })
                    .update({
                        max: true
                    })
                    .returning('*')
                    .then(user => res.json(user[0]))
                }
            })
            .catch(err => res.status(400).json('An error occured'))
        } else {
            res.status(400).json('Forgot username and/or password')
        }
    })
    .catch(err => res.status(400).json('Forgot username and/or password'))
}

module.exports = {
    handleSignin
}
