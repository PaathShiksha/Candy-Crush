document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function candyCrushGame() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const width = 8;
    const squares = [];
    let score = 0;

    const candyColors = [
        "url(src/candy/red-candy.png)",
        "url(src/candy/blue-candy.png)",
        "url(src/candy/green-candy.png)",
        "url(src/candy/yellow-candy.png)",
        "url(src/candy/orange-candy.png)",
        "url(src/candy/purple-candy.png)",
    ];

    const moveSound = document.getElementById("move-sound");
    const matchSound = document.getElementById("match-sound");

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            square.style.backgroundImage = candyColors[Math.floor(Math.random() * candyColors.length)];
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach(square => {
        square.addEventListener("dragstart", dragStart);
        square.addEventListener("dragend", dragEnd);
        square.addEventListener("dragover", dragOver);
        square.addEventListener("dragenter", dragEnter);
        square.addEventListener("dragleave", dragLeave);
        square.addEventListener("drop", dragDrop);
    });

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        this.style.backgroundImage = "";
    }

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        const validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        const validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            moveSound.play();
            squareIdBeingReplaced = null;
        } else {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    function moveIntoSquareBelow() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";

                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && squares[i].style.backgroundImage === "") {
                    squares[i].style.backgroundImage = candyColors[Math.floor(Math.random() * candyColors.length)];
                }
            }
        }
    }

    function checkMatches(pattern, points) {
        for (let i = 0; i < squares.length; i++) {
            const isBlank = squares[i].style.backgroundImage === "";
            if (pattern.some(offset => i + offset >= squares.length) || isBlank) continue;

            const match = pattern.map(offset => i + offset);
            const decidedColor = squares[i].style.backgroundImage;

            if (match.every(index => squares[index].style.backgroundImage === decidedColor)) {
                score += points;
                scoreDisplay.innerHTML = score;
                matchSound.play();
                match.forEach(index => squares[index].style.backgroundImage = "");
            }
        }
    }

    function checkRowForFour() {
        const notValid = [
            5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31,
            37, 38, 39, 45, 46, 47, 53, 54, 55
        ];
        checkMatches([0, 1, 2, 3], 4, notValid);
    }

    function checkColumnForFour() {
        checkMatches([0, width, width * 2, width * 3], 4);
    }

    function checkRowForThree() {
        const notValid = [
            6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55
        ];
        checkMatches([0, 1, 2], 3, notValid);
    }

    function checkColumnForThree() {
        checkMatches([0, width, width * 2], 3);
    }

    window.setInterval(function () {
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
    }, 100);
}