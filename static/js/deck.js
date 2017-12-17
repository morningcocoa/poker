function Deck() {
	this.suits = ['c', 'd', 'h', 's'];
    this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    this.ND = [];			// Not-yet-dealt
	this.D = []; 			// Dealt

    this.create();
    this.shuffle();
}

Deck.prototype.create = function() {
    let suitsLength = this.suits.length;
    let ranksLength = this.ranks.length;
    for (let i=0; i<suitsLength; i++) {
        for (let j=0; j<ranksLength; j++) {
        	let card = new Card();
        	card.suit = this.suits[i];
            card.rank = this.ranks[j];
            card.value = this.values[j];
            this.ND.push(card);
        }
    }
};

Deck.prototype.shuffle = function() {
    let deckLength = this.ND.length, shuffledValue, randomIndex;
    while (0 !== deckLength) {
        randomIndex = Math.floor(Math.random() * deckLength);
        deckLength -= 1;
        shuffledValue = this.ND[deckLength];
        this.ND[deckLength] = this.ND[randomIndex];
        this.ND[randomIndex] = shuffledValue;
    }
};

Deck.prototype.dealOne = function () {
	let dealtCard = this.ND.pop();
    this.D.push(dealtCard);
    return dealtCard;
};

Deck.prototype.display = function () {
  	return this.D, this.ND;
};