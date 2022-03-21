const handleSignup = (req, res, db, bcrypt) => {
    const {name, email, password, confirmPassword} = req.body;

    const hash = bcrypt.hashSync(password, 8);

    if (password === confirmPassword) {
        db.transaction(trx => {
            trx.insert({
                email: email.toLowerCase().trim(),
                hash: hash
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                trx('users')
                .returning('*')     // the 'returning' method specifies which column should be returned by the insert, update and delete methods. in this case, '*' means we're returning all the columns as the response
                .insert({
                    name: name,
                    email: loginEmail[0].email.toLowerCase().trim(),
                    joined: new Date(),
                    compare: new Date()
                })
                .then(user => {
                    res.json(user[0])
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(404).json('Email already registered'))
    } else {
        res.json('Mismatch')
    }
}

module.exports = {
    handleSignup: handleSignup
}