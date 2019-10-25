// IIFE wrap
(function(){

  var pokemonRepository = (function(){
    var repository =[];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=900';

    // returns an array of values being pushed by the 'add()' function
    function getAll(){
      return repository;
    }
    // pushes any values from 'loadList' function to the 'repository' array
    function add(item){
      repository.push(item);
    }

    //fetch pokemon data from API and loop it in a json 'pokemon' object
    function loadList(){
      return $.ajax(apiUrl, {dataType: 'json'}).then(function(item){
        $.each(item.results, function(index, item){
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          }
          // Adds the retrieved data to the Repository
          add(pokemon)
        })
        }).catch(function(e){
        console.error(e);
      });
    }

    function loadDetails(item){
      var url = item.detailsUrl;
      return $.ajax(url).then(function(details){
        // add the details to the item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.id = details.id;
				item.weight = details.weight;
        item.types = details.types.map(function(pokemon) {
        return pokemon.type.name;
      });

      }).catch(function(e){
        console.error(e);
      });
    }
    // returning all functions
    return {
      add: add,
      getAll: getAll,
      loadList: loadList,
      loadDetails: loadDetails
    };
  })();

  var $pokemonList = $('.pokemon-list')

  function addListItem(pokemon){
    var listItem = $('<button type="button" class="pokemon-list_item list-group-item list-group-item-action" data-toggle="modal" data-target="#pokemon-modal"></button>');
    listItem.text(pokemon.name);
    $pokemonList.append(listItem);
    listItem.click(function() {
      showDetails(pokemon)
    });
  }

  //Modal display details about pokemon rom 'pokemon': img, height and type
  function showDetails(pokemon){
    pokemonRepository.loadDetails(pokemon).then(function() {
      // creates Modal
      var modal = $('.modal-body');
      /*eslint no-unused-vars: ["error", { "varsIgnorePattern": "name" }]*/
      var name = $('.modal-title').text(pokemon.name);
      var pokedexnumber = $('<p class="pokemon-height"></p>').text('Pokedex Number: ' + pokemon.id );
      var height = $('<p class="pokemon-height"></p>').text('Height: ' + pokemon.height + ' Decimetres.');
      var weight = $('<p class="pokemon-weight"></p>').text('Weight: ' + pokemon.weight + ' Hectograms.');
      var type = $('<p class="pokemon-type"></p>').text('Type: ' + pokemon.types + '.');
      var image = $('<img class="pokemon-picture">');
      image.attr('src', pokemon.imageUrl);

      if(modal.children().length) {
        modal.children().remove();
      }

      modal.append(image)
        .append(pokedexnumber)
				.append(height)
				.append(weight)
        .append(type);
    });
  }

  //Search pokemons
  $(document).ready(function(){
    $('#pokemon-search').on('keyup', function(){
      var value = $(this).val().toLowerCase();
      $('.pokemon-list_item').filter(function(){
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });

  pokemonRepository.loadList().then(function(){
    var pokemons = pokemonRepository.getAll();

    $.each(pokemons, function(index, pokemon){
        addListItem(pokemon);
    });
  });
})();//IIFE wrap
