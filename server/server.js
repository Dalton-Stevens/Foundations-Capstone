const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const {
    getPokemon,
    getPokeCard,
    choosePokemon,
    showTeam,
    getTeam,
    deletePokemon
} = require('./controller');

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/v2/pokemon/', getPokemon);
app.get('/api/v2/pokemon/', getPokeCard);
app.post('/api/v2/pokemon/choosepokemon', choosePokemon);
app.get('/api/v2/pokemon/showteam', showTeam);
app.get('/api/v2/pokemon/getteam', getTeam)
app.delete('/api/pokemon/:index', deletePokemon);

app.listen(4040, console.log('All good to go on 4040!'));