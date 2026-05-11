//! in this make a common function IIFE

!function(){
    let myBtnArray = [];
    let toggle = false; // false = X (Human/P1), true = O (Computer/P2)
    let checkRun = true;
    let result = Array(9).fill("");
    let isVsComputer = true;
    
    const overlay = document.getElementById('overlay');
    const winnerDisplay = document.getElementById('winner-display');
    const p1Info = document.getElementById('p1-info');
    const p2Info = document.getElementById('p2-info');
    const p1Label = document.getElementById('p1-label');
    const p2Label = document.getElementById('p2-label');
    const playerNameInput = document.getElementById('player-name');
    const player2NameInput = document.getElementById('player2-name');
    const p2InputGroup = document.getElementById('p2-input-group');
    const pvpBtn = document.getElementById('pvp-mode');
    const pvcBtn = document.getElementById('pvc-mode');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const backBtn = document.getElementById('back-to-setup');

    Array(9).fill("").forEach((item,index) => {
        myBtnArray[index] = document.getElementById(`btn_${index+1}`);
    });

    const winningCombinations = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // cols
        [0,4,8], [2,4,6]           // diagonals
    ];

    const updateStatus = () => {
        const p1Name = playerNameInput.value || "Player 1";
        const p2Name = isVsComputer ? "Computer" : (player2NameInput.value || "Player 2");
        
        p1Label.innerText = p1Name;
        p2Label.innerText = p2Name;

        if (toggle) {
            p1Info.classList.remove('active');
            p2Info.classList.add('active');
        } else {
            p2Info.classList.remove('active');
            p1Info.classList.add('active');
        }
    };

    const CheckWinner = (currentBoard) => {
        let winner = null;
        let winningLine = null;

        winningCombinations.forEach(combination => {
            const [a, b, c] = combination;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                winner = currentBoard[a];
                winningLine = combination;
            }
        });

        if (winner) {
            return { winner, winningLine };
        }

        if (currentBoard.every(cell => cell !== "")) {
            return { winner: "Tie" };
        }

        return null;
    };

    const minimax = (board, depth, isMaximizing) => {
        const res = CheckWinner(board);
        if (res) {
            if (res.winner === "O") return 10 - depth;
            if (res.winner === "X") return depth - 10;
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const computerMove = () => {
        if (!checkRun) return;
        
        let bestScore = -Infinity;
        let move = -1;
        for (let i = 0; i < 9; i++) {
            if (result[i] === "") {
                result[i] = "O";
                let score = minimax(result, 0, false);
                result[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        if (move !== -1) {
            makeMove(move);
        }
    };

    const makeMove = (index) => {
        if (!result[index] && checkRun) {
            const currentPlayer = toggle ? "O" : "X";
            result[index] = currentPlayer;
            
            const iconName = currentPlayer === "X" ? "x" : "circle";
            const iconClass = currentPlayer === "X" ? "x-icon" : "o-icon";
            myBtnArray[index].innerHTML = `<i data-lucide="${iconName}" class="${iconClass}"></i>`;
            lucide.createIcons();

            const gameStatus = CheckWinner(result);
            
            if (gameStatus) {
                checkRun = false;
                if (gameStatus.winningLine) {
                    gameStatus.winningLine.forEach(idx => {
                        myBtnArray[idx].classList.add('winning-cell');
                    });
                }
                setTimeout(() => {
                    overlay.classList.add('show');
                    if (gameStatus.winner === "Tie") {
                        winnerDisplay.innerText = "It's a Tie!";
                    } else {
                        const winnerName = gameStatus.winner === "X" ? p1Label.innerText : (isVsComputer ? "Computer" : p2Label.innerText);
                        winnerDisplay.innerText = `${winnerName} Wins!`;
                    }
                }, 600);
            } else {
                toggle = !toggle;
                updateStatus();
                
                // If it's now Computer's turn (O), trigger it automatically
                if (isVsComputer && toggle) {
                    setTimeout(computerMove, 600);
                }
            }
        }
    };

    myBtnArray.forEach((item, index) => {
        item.addEventListener("click", () => {
            // Only allow move if it's Human's turn (X) or if playing vs Player
            if (isVsComputer && toggle) return; 
            
            if (!result[index] && checkRun) {
                makeMove(index);
            }
        });
    });

    pvpBtn.addEventListener('click', () => {
        isVsComputer = false;
        pvpBtn.classList.add('active');
        pvcBtn.classList.remove('active');
        p2InputGroup.classList.remove('hidden');
        updateStatus();
    });

    pvcBtn.addEventListener('click', () => {
        isVsComputer = true;
        pvcBtn.classList.add('active');
        pvpBtn.classList.remove('active');
        p2InputGroup.classList.add('hidden');
        updateStatus();
    });

    playerNameInput.addEventListener('input', updateStatus);
    player2NameInput.addEventListener('input', updateStatus);

    startGameBtn.addEventListener('click', () => {
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
        updateStatus();
    });

    backBtn.addEventListener('click', () => {
        gameScreen.classList.remove('active');
        startScreen.classList.add('active');
        // Reset game state when going back
        result = Array(9).fill("");
        toggle = false;
        checkRun = true;
        myBtnArray.forEach(btn => {
            btn.innerHTML = "";
            btn.classList.remove('winning-cell');
        });
    });

    updateStatus();
}();
