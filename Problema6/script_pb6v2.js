const n = 4;
let puzzle = [];
let emptyPos = {row: n - 1, col: n - 1}
let moves = 0;
let timer = null;
let seconds = 0;
let bestTime = localStorage.getItem('puzzleBestTime') || null;
const imageUrl = 'image/css_sprites.png';

const $container = $('#puzzle-container');
const $timerElement = $('#timer');
const $bestTimeElement = $('#best-time');
const $movesElement = $('#moves');
const $shuffleBtn = $('#shuffle-btn');
const $solveBtn = $('#solve-btn');
const $newGameBtn = $('#new-game-btn');


function initGame() {
    stopTimer();
    moves = 0;
    seconds = 0;
    updateStats();
    initPuzzle();
}

function initPuzzle() {
    puzzle = [];
    let counter = 1;
    for (let i = 0; i < n; i++) {
        puzzle[i] = [];
        for (let j = 0; j < n; j++) {
            if (i === n-1 && j === n-1) {
                puzzle[i][j] = 0; // Empty cell
            } else {
                puzzle[i][j] = counter++;
            }
        }
    }
    emptyPos = {row: n-1, col: n-1};
    renderPuzzle();
}

function shufflePuzzle() {
    let numbers = [];
    for (let i = 1; i < n*n; i++) {
        numbers.push(i);
    }
    numbers.push(0);

    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let index = 0;
    for (let i = 0; i < n; i++) {
        puzzle[i] = [];
        for (let j = 0; j < n; j++) {
            puzzle[i][j] = numbers[index++];
            if (puzzle[i][j] === 0) {
                emptyPos = {row: i, col: j};
            }
        }
    }

    moves = 0;
    seconds = 0;
    startTimer();
    renderPuzzle();
    updateStats();
}

function renderPuzzle() {
    const $table = $('<table></table>');

    for (let i = 0; i < n; i++) {
        const $row = $('<tr></tr>');

        for (let j = 0; j < n; j++) {
            const $cell = $('<td></td>');

            if (puzzle[i][j] === 0) {
                $cell.addClass('empty');
            } else {
                const $piece = $('<div></div>');
                $piece.addClass('puzzle-piece');
                $piece.css('background-image', `url(${imageUrl})`);

                // Calculate background position for the sprite
                const col = (puzzle[i][j] - 1) % n;
                const row = Math.floor((puzzle[i][j] - 1) / n);
                $piece.css('background-position', `-${col * 100}px -${row * 100}px`);

                $cell.append($piece);
            }

            $cell.on('click', () => handleCellClick(i, j));
            $row.append($cell);
        }

        $table.append($row);
    }

    $container.empty().append($table);
}

function handleCellClick(row, col) {
    if (timer === null && moves === 0) {
        startTimer();
    }

    // Check if the clicked cell is adjacent to the empty cell
    if ((Math.abs(row - emptyPos.row) === 1 && col === emptyPos.col) ||
        (Math.abs(col - emptyPos.col) === 1 && row === emptyPos.row)) {
        // Swap cells
        puzzle[emptyPos.row][emptyPos.col] = puzzle[row][col];
        puzzle[row][col] = 0;
        emptyPos = {row, col};
        moves++;
        updateStats();
        renderPuzzle();
        checkWin();
    }
}

function handleKeyDown(e) {
    if (timer === null && moves === 0) {
        startTimer();
    }

    let newRow = emptyPos.row;
    let newCol = emptyPos.col;

    switch(e.key) {
        case 'ArrowUp':
            newRow = emptyPos.row + 1;
            break;
        case 'ArrowDown':
            newRow = emptyPos.row - 1;
            break;
        case 'ArrowLeft':
            newCol = emptyPos.col + 1;
            break;
        case 'ArrowRight':
            newCol = emptyPos.col - 1;
            break;
        default:
            return;
    }

    if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
        puzzle[emptyPos.row][emptyPos.col] = puzzle[newRow][newCol];
        puzzle[newRow][newCol] = 0;
        emptyPos = {row: newRow, col: newCol};
        moves++;
        updateStats();
        renderPuzzle();
        checkWin();
    }
}

function checkWin() {
    let counter = 1;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === n-1 && j === n-1) {
                if (puzzle[i][j] !== 0) return false;
            } else {
                if (puzzle[i][j] !== counter++) return false;
            }
        }
    }

    stopTimer();
    updateBestTime();

    setTimeout(() => {
        alert(`Congratulations! You solved the puzzle in ${formatTime(seconds)} with ${moves} moves!`);
    }, 100);
}

function startTimer() {
    if (timer === null) {
        timer = setInterval(() => {
            seconds++;
            updateStats();
        }, 1000);
    }
}

function stopTimer() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateBestTime() {
    if (bestTime === null || seconds < bestTime) {
        bestTime = seconds;
        localStorage.setItem('puzzleBestTime', bestTime);
        updateStats();
    }
}

function updateStats() {
    $timerElement.text(`Time: ${formatTime(seconds)}`);
    $movesElement.text(`Moves: ${moves}`);

    if (bestTime !== null) {
        $bestTimeElement.text(`Best Time: ${formatTime(bestTime)}`);
    } else {
        $bestTimeElement.text(`Best Time: --:--`);
    }
}

$(function(){
    $shuffleBtn.on('click', shufflePuzzle);
    $solveBtn.on('click', initPuzzle);
    $newGameBtn.on('click', initGame);
    $(document).on('keydown', handleKeyDown);

    initGame();
})