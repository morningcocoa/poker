/**
 * Poker game index.js
 * Utilizes jquery to simulate a poker game
 */


// Global variables
let game = new Game();
const suitMap = {"c": "clubs",
			     "d": "diamonds",
			     "h": "hearts",
			     "s": "spades"};

$(document).ready( function() {

	// Modal to add a new player
	$("#add-player-button").click(function() {
		$("#new-player-modal").modal("show");
	});

	// Saving a new player
	$("#new-player-modal .btn-primary").click(function() {
		let newPlayerName = $("#new-player-modal input").val();
		let numberOfPlayers = game.countHands();
		let newPlayerID = numberOfPlayers + 1;
		let newPlayerLabel = $(".clone-label").clone().removeClass("clone-label");
		let newPlayerObject = $(".clone-object").clone().removeClass("clone-object").attr("data-id", newPlayerID);
		if (newPlayerName.trim() == "") {
			alert("Please enter a name.");
			return;
		}
		game.addHand({
			id: newPlayerID,
		    name: newPlayerName,
		});
		newPlayerLabel.find(".current-player-name").text(newPlayerName);
		newPlayerObject.find("h4").text(newPlayerName);
		newPlayerObject.find(".player-count").text(newPlayerID);
		// Clear the modal, once player is added
		$("#new-player-modal input").val("");
		$("#new-player-modal").modal("hide");
		// Show added players
		$("#current-players li.current-player-placeholder").hide();
		$("#current-players").append(newPlayerLabel);
		$("#players").append(newPlayerObject);
		// Can play the game if > 2
		numberOfPlayers = game.countHands();
		if (numberOfPlayers >= 2)
			$("#start-game-button").removeAttr("disabled");
		// Check if countHands > 5
		if (numberOfPlayers >= 5)
			$("#add-player-button").attr("disabled", "disabled");
	});

	// Once added enough players (2)
	// You can start the game
	$("#start-game-button").click(function() {
		$("#poker-intro").fadeOut();
		$("#control-panel, #players .player").fadeIn();
	});

	// Start the first game
	$("#start-round-button").click(function() {
		$(this).attr("disabled", "disabled");
		game.startGame();
		$(".player-hand").fadeIn();
	});

	// After the first game, show results
	$("#show-results-button").click(function() {
		$(this).attr("disabled", "disabled");
		$("#next-round-button").removeAttr("disabled");
		let winner = game.determineWinner();
		let winnerID = winner.id;
		let winnerName = winner.name;
		// Iterates through each card and sets their value
		for (let i=1; i<=game.hands.length; i++) {
			for (let j=1; j<=5; j++) {
				game.hands[i - 1].sortBySuit();
				game.hands[i - 1].sortByValue();
				$(".player[data-id='" + i + "'] .card[data-id='" + j + "']").addClass(suitMap[game.hands[i - 1].cards[j - 1].suit]);
				$(".player[data-id='" + i + "'] .card[data-id='" + j + "']").addClass("rank" + game.hands[i - 1].cards[j - 1].value);
			}
			// Show each players best hand
			$(".player[data-id='" + i + "'] .label").text(game.hands[i - 1].bestHand);
		}
		// Flips every card
		$(".player .card").find(".back").addClass("face").removeClass("back");
		// Label winner
		$("[data-id='" + winnerID + "']").addClass("winner");
	});

	// After completing a round of poker
	// You can continue to play with this button
	$("#next-round-button").click(function() {
		$(this).attr("disabled", "disabled");
		game.reset();
		game.startGame();
		// Resets the whole game visually
		$(".player-hand").fadeOut(function() {
			$(".player .card").removeClass("rank2 rank3 rank4 rank5 rank6 rank7 rank8 rank9 rank10 rank11 rank12 rank13 rank14");
			$(".player .card").removeClass("clubs diamonds hearts spades");
			$(".player .card").find(".face").addClass("back").addClass("face");
			$(".player .label").text("");
			$(".player").removeClass("winner");
			$("#show-results-button").removeAttr("disabled");
			$(".player-hand").fadeIn(250);
		});
	});
});