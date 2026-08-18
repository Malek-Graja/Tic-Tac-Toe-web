const DATA_KEY = "tictactoe_data";
let currentUser = null;
let player = 1;
let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

function loadData() {
    const data = localStorage.getItem(DATA_KEY);
    if (!data) {
        const defaultData = { users: {}, history: [] };
        saveData(defaultData);
        return defaultData;
    }
    return JSON.parse(data);
}

function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

const loginFrame = document.getElementById("login-frame");
const gameFrame = document.getElementById("game-frame");
const historyFrame = document.getElementById("history-frame");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginStatusLabel = document.getElementById("login-status");

const turnLabel = document.getElementById("turn-label");
const cells = document.querySelectorAll(".cell");
const historyList = document.getElementById("history-text");

function register() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
        loginStatusLabel.textContent = "Veuillez entrer un nom d'utilisateur et un mot de passe valides.";
        loginStatusLabel.style.color = "red";
        return;
    }

    const data = loadData();
    if (data.users[username]) {
        loginStatusLabel.textContent = "Nom d'utilisateur déjà pris.";
        loginStatusLabel.style.color = "red";
    } else {
        data.users[username] = password;
        saveData(data);
        loginStatusLabel.textContent = "Inscription réussie ! Vous pouvez maintenant vous connecter.";
        loginStatusLabel.style.color = "green";
    }
}

function login() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
        loginStatusLabel.textContent = "Veuillez entrer un nom d'utilisateur et un mot de passe valides.";
        loginStatusLabel.style.color = "red";
        return;
    }

    const data = loadData();
    if (data.users[username] && data.users[username] === password) {
        currentUser = username;
        loginStatusLabel.textContent = "Connexion réussie !";
        loginStatusLabel.style.color = "green";
        loginFrame.classList.add("hidden");
        gameFrame.classList.remove("hidden");
    } else {
        loginStatusLabel.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
        loginStatusLabel.style.color = "red";
    }
}

function logGameResult(winner) {
    const data = loadData();
    const now = new Date();
    
    const dateStr = now.toISOString().replace("T", " ").substring(0, 19);

    const matchRecord = {
        player1: currentUser,
        player2: "Joueur 2",
        winner: winner,
        date: dateStr
    };

    data.history.push(matchRecord);
    saveData(data);
}

function showHistory() {
    const data = loadData();
    historyList.innerHTML = "";

    data.history.forEach(match => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div>Joueur 1: ${match.player1}</div>
            <div>Joueur 2: ${match.player2}</div>
            <div>Gagnant: ${match.winner}</div>
            <div>Date: ${match.date}</div>
        `;

        historyList.appendChild(li);
    });

    gameFrame.classList.add("hidden");
    historyFrame.classList.remove("hidden");
}

function makeMove(row, col, cellBtn) {
    if (board[row][col] === 0) {
        board[row][col] = player;
        
        const symbol = player === 1 ? "X" : "O";
        cellBtn.textContent = symbol;

        if (checkWinner(board)) {
            const winMessage = `Le joueur ${player} a gagné !`;
            logGameResult(winMessage);
            turnLabel.textContent = winMessage;
            turnLabel.style.color = "green";
            cells.forEach(btn => btn.disabled = true);
            return;
        } else if (checkDraw(board)) {
            const drawMessage = "Match nul !";
            logGameResult(drawMessage);
            turnLabel.textContent = drawMessage;
            turnLabel.style.color = "blue";
            return;
        } else {
            player = player === 1 ? 2 : 1;
            turnLabel.textContent = `C'est au tour du joueur ${player}.`;
            turnLabel.style.color = "black";
        }
    } else {
        turnLabel.textContent = "Case déjà occupée ! Veuillez choisir une autre case.";
        turnLabel.style.color = "red";
    }
}

function checkWinner(board) {
    for (let i = 0; i < 3; i++) {
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== 0) {
            return true;
        }
    }
    for (let j = 0; j < 3; j++) {
        if (board[j][0] === board[j][1] && board[j][1] === board[j][2] && board[j][0] !== 0) {
            return true;
        }
    }
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== 0) {
        return true;
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== 0) {
        return true;
    }

    return false;
}

function checkDraw(board) {
    if (checkWinner(board)) return false;
    
    for (let row of board) {
        if (row.includes(0)) return false;
    }
    return true;
}

function resetGame() {
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    player = 1;
    turnLabel.textContent = "Le joueur 1 est X et le joueur 2 est O.";
    turnLabel.style.color = "black";

    cells.forEach(btn => {
        btn.textContent = "";
        btn.disabled = false;
    });
}

document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("register-btn").addEventListener("click", register);

cells.forEach(cell => {
    cell.addEventListener("click", (e) => {
        const row = parseInt(e.target.getAttribute("data-row"));
        const col = parseInt(e.target.getAttribute("data-col"));
        makeMove(row, col, e.target);
    });
});

document.getElementById("reset-btn").addEventListener("click", resetGame);
document.getElementById("history-btn").addEventListener("click", showHistory);

document.getElementById("back-btn").addEventListener("click", () => {
    historyFrame.classList.add("hidden");
    gameFrame.classList.remove("hidden");
});