var express = require('express');


var app = express();


app.get('/:etagenum', function(req, res) {
    const noms = ['Robert', 'Jacques', 'David'];
    res.render('index.ejs', {etage: req.params.etagenum, noms: noms});
});


app.listen(8080);
