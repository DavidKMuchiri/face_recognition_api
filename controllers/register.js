const handleRegister = (req, res, db, bcrypt) =>{
    const {name, email, password} = req.body;
    if(!email || !name || !password){
      return res.status(400).json("Incorrect form submission");
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx =>{
        // Below is where I have returned the promise as mentioned in the comments below
       return trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            }).catch(error => res.status(400).json('Unable to register'))
        })
        // You will see that the teacher uses the statements below since he does not initially return
        // a promise as I have done within the transaction handler. These below statements
        // or the returning of a promise is to ensure the process does not hang hence not finishing.
        // You can read about it more here : https://knexjs.org/guide/transactions.html#:~:text=Throwing%20an%20error,connection%20will%20hang.
        // Also if you return promise from transaction, then trx.rollback / tx.commit is called automatically, so no need to call them explicitly.
        // .then(trx.commit)
        // .catch(trx.rollback)
        .catch(error => res.status(400).json('Unable to register user'))

    })
}

module.exports = {
    handleRegister: handleRegister
}