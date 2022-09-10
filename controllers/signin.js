const handleSignin = (db, bcrypt) => (req, res) =>{
    if(!req.body.email || !req.body.password){
        return res.status(400).json("Incorrect form submission");
      }
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data =>{
       const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
       if(isValid){
            db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user=>{
                
                res.json(user[0]);
            })
            // .catch(error => res.status(400).json('User not found 1'))
            // I have decided to comment the above statement as it will never be called
            // since if the first 'where' has an an error, its .catch will trigger and not
            // even care about waht is in the body.
       }else{
            res.status(400).json('Incorrect username or password');
       }
    })
    .catch(error => res.status(400).json('Incorrect username or password'));
}

module.exports ={
    handleSignin: handleSignin
}