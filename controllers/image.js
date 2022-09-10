const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '3c5701297b5b46a7965a24c6b82668b9'
   });

const handleApiCall = (req, res) =>{
app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data =>{
        res.json(data);
    })
    .catch(error => res.status(400).json("Unable to work with API"));
}


const imageHandler = (req, res, db) =>{
        const { id } = req.body;
        db('users')
        .where('id' , '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries =>{
            res.json(entries[0].entries);
        }).catch(error => res.status(400).json('Unable to get entries'))
}

module.exports ={
    imageHandler: imageHandler,
    handleApiCall: handleApiCall
}