function Game() {
    this.hands = [];
    this.deck = new Deck();
};

Game.prototype.reset = function() {
    this.deck = new Deck();
    for (let i=0; i<game.hands.length; i++) {
        this.hands[i].cards = [];
    }
};

Game.prototype.startGame = function() {
	this.reset();
    for (let i=0; i<5; i++) {
	    for (let j=0; j<this.hands.length; j++) {
	        this.hands[j].addCard();
	    }
	}
};

Game.prototype.countHands = function() {
    return this.hands.length;
};

Game.prototype.addHand = function(attr) {
    let newHand = new Hand(attr);
    newHand.game = this;
    this.hands.push(newHand);
};

Game.prototype.determineWinner = function() {
	let bestHand = null;
	let bestScore = 0;
	for (let j=0; j<this.hands.length; j++) {
        let currentHandScore = this.hands[j].calculateScore();
        if (bestScore < currentHandScore) {
        	bestHand = j;
        	bestScore = currentHandScore;
        }
    }
    return this.hands[bestHand];
};

