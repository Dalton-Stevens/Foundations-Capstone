let team = [];

module.exports = {
    getPokemon: (req, res) => {
        res.status(200).send(res.data);
    },
    getPokeCard: (req, res) => {
        res.status(200).send(res.data);
    },
    choosePokemon: (req, res) => {
        if (team.length < 6) {
            team.push(req.body);
        };
        res.status(200).send(req.body);
    },
    showTeam: (req, res) => {
        res.status(200).send(team);
    },
    getTeam: (req, res) => {
        res.status(200).send(team);
    },
    deletePokemon: (req, res) => {
        team.splice(+req.params.index, 1);
        res.status(200).send(team);
    }
};