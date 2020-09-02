document.addEventListener('DOMContentLoaded', e => {
    const BASE_URL = "http://localhost:3000"
    const TRAINERS_URL = `${BASE_URL}/trainers/`
    const POKEMONS_URL = `${BASE_URL}/pokemons/`
    
    //create a variable that will represent the 'main' container where
    // the pokemon 'card' div's will be in
    const main = document.querySelector('main')
    // console.log(main)

    //function to fetch the pokemon data
    const getTrainers = () => {
        fetch(TRAINERS_URL)
        .then(resp => resp.json())
        .then(trainers => renderTrainers(trainers)) //aspirational code
    }

    const renderTrainers = (trainers) => {
        trainers.forEach(trainer => {
            const trainerDiv = renderTrainer(trainer) //aspirational code that will create the trainer div card
            const ul = document.createElement('ul') //this ul will hold the pokemon
            trainerDiv.append(ul) //append the 'ul' to the trainer's div
            // debugger
            trainer.pokemons.forEach(pokemon => {
                renderPokemon(pokemon, ul)     // use .forEach to loop through each pokemon of a trainer
            })                                 // then renderPokemon(aspiration code) into the 'ul' created earlier
        })                                    // the arguments will be each pokemon(singular) and a 'ul'
    }

    const renderTrainer = (trainer) => {
        //create a new div for each trainer
        // add a class of card to the div
        // add innerHTML
        let card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML = `
            <p>${trainer.name}</p>
            <button class="add-btn" data-trainer-id="${trainer.id}">Add Pokemon</button>
        `
        main.append(card)
        return card
    }

    const renderPokemon = (pokemon, ul) => {
        // since the pokemon will go into a 'ul', create an 'li' for each individual pokemon
        let li = document.createElement('li')

        //now put the HTML into the 'li' that will show the pokemon details
        li.innerHTML = `
        <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
        `
        // Finally, append the newly created 'li' for the pokemon, to the 'ul' that 
        // contains the collection of pokemon that belongs to the specific trainer
        ul.append(li)
    }

    // now create the functions to add/release pokemon
        //can only add pokemon for a max of 6
    const clickHandler = () => {
        document.addEventListener('click', e => {
            // console.log(e.target)
            let pokeUl = e.target.nextElementSibling
            if (e.target.matches('.add-btn') && pokeUl.childElementCount < 6) {
    // console.log(e.target)
    // debugger
                
                //Now that I need to add anothe pokemon, create a new 'li' element
                let newLi = document.createElement('li')
                
                //the 'li' gets nested within a 'ul', so now create a variable
                // that represents that 'ul' ---> nextElementSibling to the e.target?

                //set a variable to the trainer's id --> use 'dataset'
                let trainerId = e.target.dataset.trainerId
                // debugger

                //append the new 'li' into the 'ul'
                pokeUl.append(newLi)

                //Now, I have to create a fetch->POST request to the DB
                // create a variable for 'options' for simplicity

                const options = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    body: JSON.stringify({trainer_id: trainerId})
                    } 

                fetch(POKEMONS_URL, options)
                .then(response => response.json())
                .then(pokemon => renderPokemon(pokemon, pokeUl))
            } else if (e.target.matches('.release')) {
                pokeId = e.target.dataset.pokemonId
                // console.log(pokeId)
                // debugger

                const options = {
                    method:"DELETE"
                }

                fetch(POKEMONS_URL + pokeId, options)
                .then(response => response.json())
                .then(pokemon => {
                    let x = document.querySelector(`[data-pokemon-id="${pokemon.id}"]`)
                    x.parentElement.remove()
                })
            } else if (pokeUl.childElementCount == 6) {
                return alert("Already have 6 pokemon! Don't be greedy!!!");
            } 
        })
    }

    //invoke the appropriate functions
    getTrainers()
    clickHandler()
})


