/**
 * Poker values to determine the hand's score 
 */
const straightFlushValue   = 8000000; 
const fourOfAKindValue     = 7000000; 
const fullHouseValue       = 6000000; 
const flushValue           = 5000000;  
const straightValue        = 4000000;   
const threeOfAKindValue    = 3000000;    
const twoPairsValue        = 2000000;     
const onePairValue         = 1000000;

function Hand(options) {
    this.id = options.id;
    this.name = options.name;
    this.cards = [];
    this.bestHand = "";
    this.game = null;
}

Hand.prototype.display = function() {
    this.sortByValue();
    return this.cards;
};

Hand.prototype.addCard = function() {
    this.cards.push(this.game.deck.dealOne());
};

/**
  * Value sorted, then suit, so suit takes precedence
  */
Hand.prototype.sortBySuit = function() {
    this.cards.sort(function(a, b) {
        return a.value - b.value;
    });
    this.cards.sort(function(a, b) {
        if (a.suit < b.suit)
            return -1;
        if (a.suit > b.suit)
            return 1;
        return 0;
    });
};

/**
  * Suit sorted, then value, so value takes precedence
  */
Hand.prototype.sortByValue = function() {
    this.cards.sort(function(a, b) {
        if (a.suit < b.suit)
            return -1;
        if (a.suit > b.suit)
            return 1;
        return 0;
    });
    this.cards.sort(function(a, b) {
        return a.value - b.value;
    });
};

Hand.prototype.calculateScore = function() {
    if (this.hasStraight(5, true)) {
        this.bestHand = "Straight Flush";
        return this.valueStraightFlush();
    } else if (this.hasFourOfAKind()) {
        this.bestHand = "Four Of A Kind";
        return this.valueFourOfAKind();
    } else if (this.hasFullHouse()) {
        this.bestHand = "Full House";
        return this.valueFullHouse();
    } else if (this.hasFlush()) {
        this.bestHand = "Flush";
        return this.valueFlush();
    } else if (this.hasStraight(5, false)) {
        this.bestHand = "Straight";
        return this.valueStraight();
    } else if (this.hasThreeOfAKind()) {
        this.bestHand = "Three Of A Kind";
        return this.valueThreeOfAKind();
    } else if (this.hasTwoPair()) {
        this.bestHand = "Two Pair";
        return this.valueTwoPair();
    } else if (this.hasOnePair()) {
        this.bestHand = "One Pair";
        return this.valueOnePair();
    } else {
        this.bestHand = "High " + this.highestCard();
        return this.valueHighestCard();
    }
};

Hand.prototype.hasFourOfAKind = function() {
    this.sortByValue();
    let a, b;
    a = this.cards[0].value == this.cards[1].value &&
        this.cards[1].value == this.cards[2].value &&
        this.cards[2].value == this.cards[3].value;

    b = this.cards[1].value == this.cards[2].value &&
        this.cards[2].value == this.cards[3].value &&
        this.cards[3].value == this.cards[4].value; 
    return a || b;
};

Hand.prototype.hasFullHouse = function() {
    this.sortByValue();
    let a, b;
    a = this.cards[0].value == this.cards[1].value &&
        this.cards[1].value == this.cards[2].value &&
        this.cards[3].value == this.cards[4].value;

    b = this.cards[0].value == this.cards[1].value &&
        this.cards[2].value == this.cards[3].value &&
        this.cards[3].value == this.cards[4].value;
    return a || b;
};

Hand.prototype.hasFlush = function() {
    this.sortBySuit();
    return this.cards[0].suit == this.cards[4].suit;
};

Hand.prototype.hasStraight = function(len, sameSuit) {
    this.sortByValue();
    for (let i=0; i<len-2; i++) {
        if (this.cards[i].value != this.cards[i + 1].value)
            return false;
        if (sameSuit && (this.cards[i].suit != this.cards[i + 1].suit))
            return false;
    }
    return true;
};

Hand.prototype.hasThreeOfAKind = function() {
    this.sortByValue();
    let a, b, c;
    a = this.cards[0].value == this.cards[1].value &&
        this.cards[1].value == this.cards[2].value;

    b = this.cards[1].value == this.cards[2].value &&
        this.cards[2].value == this.cards[3].value;

    c = this.cards[2].value == this.cards[3].value &&
        this.cards[3].value == this.cards[4].value;
    return a || b || c;
};

Hand.prototype.hasTwoPair = function() {
    this.sortByValue();
    let a, b, c;
    a = this.cards[0].value == this.cards[1].value &&
         this.cards[2].value == this.cards[3].value;

    b = this.cards[0].value == this.cards[1].value &&
         this.cards[3].value == this.cards[4].value;

    c = this.cards[1].value == this.cards[2].value &&
         this.cards[3].value == this.cards[4].value;
    return a || b || c;
};

Hand.prototype.hasOnePair = function() {
    this.sortByValue();
    let a, b, c, d;
    a = this.cards[0].value == this.cards[1].value;
    b = this.cards[1].value == this.cards[2].value;
    c = this.cards[2].value == this.cards[3].value;
    d = this.cards[3].value == this.cards[4].value;

    return a || b || c || d;
};

Hand.prototype.highestCard = function() {
    this.sortByValue();
    let card = this.cards[4].rank;
    return card;
};

Hand.prototype.valueStraightFlush = function() {
    return straightFlushValue + this.valueHighestCard();
};

Hand.prototype.valueFourOfAKind = function() {
    this.sortByValue();
    return fourOfAKindValue + this.cards[4].value;
};

Hand.prototype.valueFullHouse = function() {
    this.sortByValue();
    return fullHouseValue + this.cards[4].value;
};

Hand.prototype.valueFlush = function() {
    return flushValue + this.valueHighestCard();
};

Hand.prototype.valueStraight = function() {
    return straightValue + this.valueHighestCard();
};

Hand.prototype.valueThreeOfAKind = function() {
    this.sortByValue();
    return threeOfAKindValue + this.cards[2].value;
};

Hand.prototype.valueTwoPair = function() {
    this.sortByValue();
    let points = 0;
    if (this.cards[0].value == this.cards[1].value && 
        this.cards[2].value == this.cards[3].value)
        points = 14 ** 2 * this.cards[2].value + 
                 14 * this.cards[0].value + this.cards[4].value;
    else if (this.cards[0].value == this.cards[1].value && 
             this.cards[3].value == this.cards[4].value)
        points = 14 ** 2 * this.cards[3].value + 
                 14 * this.cards[0].value + this.cards[2].value;
    else 
        points = 14 ** 2 * this.cards[3].value + 
                 14 * this.cards[1].value + this.cards[0].value;
    return twoPairsValue + points;
};

Hand.prototype.valueOnePair = function() {
    this.sortByValue();
    let points = 0;
    if (this.cards[0].value == this.cards[1].value)
        points = 14 ** 3 * this.cards[0].value + this.cards[2].value + 
                 14 * this.cards[3].value + 
                 14 ** 2 * this.cards[4].value;
    else if ( this.cards[1].value == this.cards[2].value )
        points = 14 ** 3 * this.cards[1].value + this.cards[0].value + 
                 14 * this.cards[3].value + 
                 14 ** 2 * this.cards[4].value;
    else if ( this.cards[2].value == this.cards[3].value )
        points = 14 ** 3 * this.cards[2].value + this.cards[0].value + 
                 14 * this.cards[1].value + 
                 14 ** 2 * this.cards[4].value;
    else
        points = 14 ** 3 * this.cards[3].value + this.cards[0].value + 
                 14 * this.cards[1].value + 
                 14 ** 2 * this.cards[2].value;
    return onePairValue + points;
};

Hand.prototype.valueHighestCard = function() {
    this.sortByValue();
    let points = this.cards[0].value + 
                14 * this.cards[1].value + 
                14 ** 2 * this.cards[2].value + 
                14 ** 3 * this.cards[3].value + 
                14 ** 4 * this.cards[4].value;
    return points;
};
