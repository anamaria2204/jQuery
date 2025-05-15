let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;
let pairsFound = 0;
let gridSize = 4;

const availableImages = Array.from({length: 32}, (_, i) => `images/img${i+1}.jpg`);


function initGame(){
    gridSize = parseInt($('#gridSize').val());
    const $gameBoard = $('#gameBoard');
    $gameBoard.empty();

    cards = [];
    pairsFound = 0;
    resetBoard();

    const totalPairs = Math.floor((gridSize* gridSize) / 2);

    const selectedImages = availableImages.slice(0, totalPairs);
    const imagePairs = [...selectedImages, ...selectedImages];

    shuffleArray(imagePairs);

    imagePairs.forEach((imageUrl1, index) =>{
        const $card = createImageCard(imageUrl1, index);
        $gameBoard.append($card);
        cards.push($card);
    });

    $gameBoard.css('grid-template-columns', `repeat(${gridSize}, 1fr)`);
}

function createImageCard(imageUrl, index) {
    const $card = $('<div>')
        .addClass('card hidden')
        .attr('data-image-url', imageUrl)
        .attr('data-index', index)
        .on('click', flipCard);


    const $img = $('<img>')
        .attr('src', imageUrl)
        .css({
            display: 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        });

    $card.append($img);
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

    const $this = $(this);

    if (firstCard && $this.is(firstCard)) return;
    if ($this.hasClass('matched')) return;

    $this.removeClass('hidden');
    $this.find('img').show();

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = $this;
        return;
    }

    secondCard = $this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.attr('data-image-url')=== secondCard.attr('data-image-url');

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
        firstCard.find('img').hide();
        secondCard.find('img').hide();
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
