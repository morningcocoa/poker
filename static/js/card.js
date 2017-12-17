function Card() {
	this.suit = "";
    this.rank = "";
    this.value = 0;
}

Card.prototype.display = function() {
	return this.suit, this.rank;
}