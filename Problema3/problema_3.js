let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;
let pairsFound = 0;
let gridSize = 4;

function initGame(){
    gridSize = parseInt($('#gridSize').val());
    const $gameBoard = $('#gameBoard');
    $gameBoard.empty();
    cards = [];
    pairsFound = 0;
    resetBoard();

    const totalPairs = Math.floor((gridSize* gridSize) / 2);

    const numbers = [];
    for (let i = 1; i <= totalPairs; i++) {
        numbers.push(i,i);
    }

    shuffleArray(numbers);

    numbers.forEach((number, index) =>{
        const $card = createCard(number, index);
        $gameBoard.append($card);
        cards.push($card);
    });
    $gameBoard.css('grid-template-columns', `repeat(${gridSize}, 1fr)`);
}

function createCard(number, index) {
    const $card = $('<div>')
        .addClass('card hidden')
        .data('number', number)
        .data('index', index)
        .text(number)
        .on('click', flipCard);
    return $card;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard?.get(0)) return;
    if ($(this).hasClass('matched')) return;

    $(this).removeClass('hidden');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = $(this);
        return;
    }

    secondCard = $(this);
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.data('number') === secondCard.data('number');

    if (isMatch) {
        disableCards();
        pairsFound++;
        checkGameOver();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.addClass('matched');
    secondCard.addClass('matched');
    resetBoard();
}

function unflipCards(){
    lockBoard = true;

    setTimeout(() =>{
        firstCard.addClass('hidden');
        secondCard.addClass('hidden');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

function checkGameOver() {
    const totalPairs = Math.floor((gridSize * gridSize) / 2);
    if(pairsFound === totalPairs) {
        setTimeout(() => {
            alert("Congratulations! You found all pairs!");
            initGame();
        }, 1000);
    }
}

$(document).ready(function(){
    $('#startButton').on('click', initGame);
    initGame();
})