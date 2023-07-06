const select = document.querySelector('select');
const pokeContainer = document.querySelector('#poke-container');
const teamContainer = document.querySelector('#team-container');
const teamCard = document.querySelector('#team-card');
const showTeamBtn = document.querySelector('#team-btn');

let pokemonTeam = [];

teamContainer.classList.add('hide');

const capitalize = (str, separators) => {
    separators = separators || [ ' ' ];
    let regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
    return str.toLowerCase().replace(regex, function(x) { return x.toUpperCase(); });
};

const getPokemon = () => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=1010')
        .then(res => {
            let {results} = res.data;
            results.forEach((pokeObj, index) => {
                let option = document.createElement('option');
                let {name} = pokeObj;
                
                option.value = name;
                option.textContent = `#${index + 1} ` + capitalize(name, ['-']);
                
                select.appendChild(option);
            })
        })
        .catch(err => console.log(err))
};

const getPokeCard = evt => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${evt.target.value}`)
        .then(res => {
            let {name, sprites, types, stats} = res.data;
            let {front_default: front} = sprites;
            
            pokeContainer.innerHTML = `
                <div id="poke-card">
                <h1 id="poke-name">${capitalize(name, ['-'])}</h1>
                <img src="${front}" id="poke-img"/>
                <h2 id="stat">HP:${stats[0].base_stat} Atk:${stats[1].base_stat} Def:${stats[2].base_stat}</h2> 
                <h2 id="stat">SpAtk:${stats[3].base_stat} SpDef:${stats[4].base_stat}</h2>
                <h2 id="stat">Speed:${stats[5].base_stat}</h2>
                <h2 id="type">${types[1] ? `${capitalize(types[0].type.name)}/${capitalize(types[1].type.name)}` : capitalize(types[0].type.name)}</h2>
                <button class="poke-btn" onclick="choosePokemon('${front}')">Add To Team</button>
                </div>
            `;

            pokeContainer.classList.remove('hide');
            pokeContainer.classList.add('show');
            teamContainer.classList.add('hide');
        })
        .catch(err => console.log(err))
};

const choosePokemon = (front) => {
    axios.post('api/v2/pokemon/choosepokemon', {img:front})
        .then(res => {
            if (pokemonTeam.length === 6) {
                return alert('You can only have 6 pokemon on your team. Please remove one before adding another.');
            };
            
            pokemonTeam.push(res.data);
            
            pokeContainer.classList.add('hide');
            pokeContainer.classList.remove('show');
        })
        .catch(err => console.log(err))
};

const showTeam = (evt) => {
    evt ? evt.preventDefault() : null;

    teamCard.innerHTML = '';

    pokemonTeam.forEach((obj, index) => {
        let pokeDiv = document.createElement('div');
        let pokePic = document.createElement('img');
        let deleteBtn = document.createElement('button');

        deleteBtn.textContent = 'X';
        deleteBtn.id = index;
        deleteBtn.addEventListener('click', deletePokemon);

        pokePic.src = `${obj.img}`;

        pokeDiv.appendChild(pokePic);
        pokeDiv.appendChild(deleteBtn);

        teamCard.appendChild(pokeDiv);
    });
    
    pokeContainer.classList.remove('show');
    pokeContainer.classList.add('hide');
    teamContainer.classList.remove('hide');
};

const getTeam = () => {
    axios.get('/api/v2/pokemon/getteam')
        .then(res => {
            pokemonTeam = res.data;
        })
        .catch(err => console.log(err))
};

const deletePokemon = evt => {
    evt.preventDefault();
    axios.delete(`/api/pokemon/${evt.target.id}`)
        .then(res => {
            pokemonTeam = res.data;
            
            showTeam();
        })
        .catch(err => console.log(err))
};

select.addEventListener('change', getPokeCard);
showTeamBtn.addEventListener('click', showTeam);
getPokemon();
getTeam();