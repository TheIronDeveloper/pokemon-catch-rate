App = Ember.Application.create();
App.ApplicationAdapter = DS.FixtureAdapter;

App.Router.map(function() {
	// TODO: Pokemon resource Route
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
		return Ember.RSVP.hash ({
			pokeballs: this.store.find('pokeball'),
			pokemon: this.store.find('pokemon'),
			levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
				30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
				58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
				86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
		});
	}
});

App.IndexController = Ember.Controller.extend({
	selectedPokemonObserver: function() {
		var thePokemonToSet = this.get('selectedPokemon'),
			pokeballs = this.get('model.pokeballs');

		pokeballs.forEach( function( pokeball ) {
			pokeball.set('pokemon', thePokemonToSet);
		});

	}.observes('selectedPokemon'),
	selectedLevelObserver: function() {
		var selectedLevel = this.get('selectedLevel'),
			pokemonList = this.get('model.pokemon');

		pokemonList.forEach( function( pokemon ) {
			pokemon.set('level', selectedLevel);
		});
	}.observes('selectedLevel')
});

App.Pokemon = DS.Model.extend({
	name: DS.attr('string'),
	baseHP: DS.attr('number'),
	level: DS.attr('number', {
		defaultValue: 1
	}),
	catchRate: DS.attr('number'),
	pokeball: DS.hasMany('pokeball'),
	maxHP: function() {

		var baseHP = this.get('baseHP'),
			level = this.get('level');

		// Because this is against a pokemon in the wild, IV and EV stats are 0
		// and therefore not factored into the equation
		var numerator = ((2 * baseHP) + 100) * level,
			denominator = 100;

		return ~~(numerator / denominator + 10);
	}.property('baseHP', 'level')
});

App.Pokeball = DS.Model.extend({
	name: DS.attr('string'),
	ballRate: DS.attr('number'),
	pokemon: DS.belongsTo('pokemon'),
	catchRate: function() {

		// TODO: these variables should be coming from the pokemon or controller
		var pokemon = this.get('pokemon');

		if (!pokemon) {
			return '';
		}

		var hpMax = pokemon.get('maxHP'),
			hpCurrent = 1,
			statusRate = 1,
			pokemonCatchRate = pokemon.get('catchRate'),
			ballRate = this.get('ballRate');

		var numerator = ((3 * hpMax - 2 * hpCurrent) * pokemonCatchRate * ballRate),
			denominator = ( 3 * hpMax),
			shakeRate = (numerator/denominator) * statusRate,
			catchProbability;

		shakeRate = shakeRate < 255 ? shakeRate : 255;
		catchProbability = (((65536 / (255/shakeRate)^0.1875) / 65536));

		return (catchProbability * 100).toFixed(2);
	}.property('rate', 'pokemon', 'pokemon.maxHP')
});

App.Pokemon.reopenClass({
	FIXTURES : [
		{
			id: 1,
			name: 'Bublasaur',
			catchRate: 45,
			baseHP: 45
		},
		{
			id: 2,
			name: 'Ivysaur',
			catchRate: 45,
			baseHP: 60
		},
		{
			id: 3,
			name: 'Venasaur',
			catchRate: 45,
			baseHP: 80
		}
	]
});

App.Pokeball.reopenClass({
	FIXTURES : [
		{
			id: 1,
			name: 'PokeBall',
			ballRate: 1
		},
		{
			id: 2,
			name: 'Great Ball',
			ballRate: 1.5
		},
		{
			id: 3,
			name: 'Ultra Ball',
			ballRate: 2
		}
	]
});