//! in this make a common function IIFE

!function(){
    let myBtnArray = [];
    let toggle = false; // false = X starts, true = O's turn (wait, original logic was toggle = !toggle then toggle ? X : O)
    let checkRun = true;
    let result = Array(9).fill("");
    const DELAY = 2000;
    
    const overlay = document.getElementById('overlay');
    const winnerDisplay = document.getElementById('winner-display');
    const p1Info = document.getElementById('p1-info');
    const p2Info = document.getElementById('p2-info');

    Array(9).fill("").forEach((item,index) => {
        myBtnArray[index] = document.getElementById(`btn_${index+1}`);
    });

    const winningCombinations = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // cols
        [0,4,8], [2,4,6]           // diagonals
    ];

    const updateStatus = () => {
        if (toggle) {
            p1Info.classList.remove('active');
            p2Info.classList.add('active');
        } else {
            p2Info.classList.remove('active');
            p1Info.classList.add('active');
        }
    };

    const CheckWinner = () => {
        let winner = null;
        let winningLine = null;

        winningCombinations.forEach(combination => {
            const [a, b, c] = combination;
            if (result[a] && result[a] === result[b] && result[a] === result[c]) {
                winner = result[a];
                winningLine = combination;
            }
        });

        if (winner) {
            winningLine.forEach(index => {
                myBtnArray[index].classList.add('winning-cell');
            });
            return winner;
        }

        if (result.every(cell => cell !== "")) {
            return "Tie";
        }

        return null;
    };

    myBtnArray.forEach((item, index) => {
        item.addEventListener("click", () => {
            if (!result[index] && checkRun) {
                // Determine current player
                const currentPlayer = toggle ? "O" : "X";
                result[index] = currentPlayer;
                
                // Set Icon
                const iconName = currentPlayer === "X" ? "x" : "circle";
                const iconClass = currentPlayer === "X" ? "x-icon" : "o-icon";
                item.innerHTML = `<i data-lucide="${iconName}" class="${iconClass}"></i>`;
                lucide.createIcons();

                const gameStatus = CheckWinner();
                
                if (gameStatus) {
                    checkRun = false;
                    setTimeout(() => {
                        overlay.classList.add('show');
                        if (gameStatus === "Tie") {
                            winnerDisplay.innerText = "It's a Tie!";
                        } else {
                            winnerDisplay.innerText = `${gameStatus} Wins!`;
                        }
                    }, 600);
                } else {
                    toggle = !toggle;
                    updateStatus();
                }
            }
        });
    });

    // Initial status set
    updateStatus();
}();
