const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image')

const form = document.querySelector('.form');
const input = document.querySelector('.input_name-id');

const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

const error = document.querySelector('form p');

const skills = document.querySelector('.skills');

let para;

let searchPokemon = 1;



const renderPokemon = async (pokemon) => { // 
    pokemonName.innerHTML = "loading...";
    await fetchPokemon(pokemon);
    clearError(error);
    clearChild();

}

const fetchPokemon = async (pokemon) => { // FAZ FETCH DO POKEMON SELECIONADO PELO USUÁRIO
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    const statusOk = async(truth) =>{
        if (truth){
        const data = await APIResponse.json();
        abilityFunc(data);
        poke('inline', data.name, data.id, data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'])
        }
    }
    APIResponse.status === 200 ? statusOk(true) : poke('none',"Not Found =(", "");
}

function poke(display, nameInner, idInner, image){ // APRESENTA O POKEMON
    pokemonImage.style.display = display;
    pokemonName.innerHTML = nameInner;
    pokemonNumber.innerHTML = idInner;
    pokemonImage.src = image;
    input.value = "";
    searchPokemon = idInner;
}  

function abilityFunc(data) {// BUSCA DENTRO DO JSON DO POKEMON O LINK PARA A HABILIDADE
    const abilities = data['abilities'];
    for (let index = 0; index < abilities.length; index++) {
        const element = abilities[index];
        const abilityUrl = element['ability']['url'];
        fetchAbility(abilityUrl);
    }
}

const fetchAbility = async (abilityUrl) => { //FAZ FETCH DA HABILIDADE E ALIMENTA A AREA DE SKILLS NA UI
    const catchAbilityInfo = await fetch(abilityUrl)
    
    if (catchAbilityInfo.status == 200){
        const data = await catchAbilityInfo.json();
        enLanguage(data)
        para = document.createElement("p")
        para.innerText = (`\n${data.name.toUpperCase()} \n ${enLanguage(data)}\n\n\n`)
        skills.appendChild(para)
    }    
}

const enLanguage = (data) => { // BUSCA DENTRO DA AREA DE HABILIDADES A HABILIDADE EM INGLES E RETORNA PARA SER UTILIZADA NA FUNNÇÃO ACIMA "FETCHABILITY"
    let englishDescriptionAbility = "";
    const effectEntries = data['effect_entries']
    for (let index = 0; index < effectEntries.length; index++) {
        const element = effectEntries[index];
        if (element['language']['name'] == 'en') {
            englishDescriptionAbility += element['effect']
            return englishDescriptionAbility
        }
    }
}
form.addEventListener('submit', (event) => { // CAIXA DE BUSCA
    event.preventDefault();
    input.value.trim() == "" ? error.innerHTML = "Insira um valor válido" : renderPokemon(input.value.toLowerCase().trim());
})

buttonPrev.addEventListener('click', () => { // BOTAO PARA ESQUERDA
    if (searchPokemon > 1) {
        searchPokemon -=1;
        renderPokemon(searchPokemon);
    }   
    clearError(error);
})

buttonNext.addEventListener('click', () => { // BOTÃO PARA DIREITA
    searchPokemon +=1;
    renderPokemon(searchPokemon);
    
})

const clearError = (error) => { //RETIRA A MENSAGEM DE ERRO
    error.innerHTML = "";
}

const clearChild = () => { //RESETA A LISTA DE SKILLS A CADA BUSCA
    while (skills.firstChild) {
        skills.removeChild(skills.firstChild);
    }
}
renderPokemon(searchPokemon);