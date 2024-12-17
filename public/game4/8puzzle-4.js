(function () {
	var state = 1;
	var puzzle = document.getElementById("puzzle");

	// Creates solved puzzle
	solve();

	// Listens for click on puzzle cells
	puzzle.addEventListener("click", function (e) {
		if (state == 1) {
			puzzle.className = "animate"; // Enables sliding animation
			shiftCell(e.target);
		}
	});

	// Listens for click on control buttons
	document.getElementById("solve").addEventListener("click", solve);
	document.getElementById("scramble").addEventListener("click", scramble);

	/*Creates solved puzzle*/
	function solve() {
		if (state == 0) return;

		puzzle.innerHTML = "";

		var n = 1;
		for (var i = 0; i < 4; i++) { // 4 rows
			for (var j = 0; j < 4; j++) { // 4 columns
				var cell = document.createElement("span");
				cell.id = "cell-" + i + "-" + j;
				cell.style.left = j * 80 + 1 * j + "px";
				cell.style.top = i * 80 + 1 * i + "px";

				if (n <= 15) { // Numbers 1-15
					cell.classList.add("number");
					cell.classList.add(
						(i % 2 == 0 && j % 2 > 0) || (i % 2 > 0 && j % 2 == 0)
							? "dark"
							: "light"
					);
					cell.innerHTML = n.toString();
					n++;
				} else {
					cell.className = "empty"; // Last cell empty
				}

				puzzle.appendChild(cell);
			}
		}
	}

	/*Shifts number cell to the empty cell*/
	function shiftCell(cell) {
		if (!cell.classList.contains("number")) return;

		var emptyCell = getEmptyAdjacentCell(cell);

		if (emptyCell) {
			// Temporary data
			var tmp = { style: cell.style.cssText, id: cell.id };

			// Exchanges id and style values
			cell.style.cssText = emptyCell.style.cssText;
			cell.id = emptyCell.id;
			emptyCell.style.cssText = tmp.style;
			emptyCell.id = tmp.id;

			if (state == 1) {
				// Checks the order of numbers
				setTimeout(checkOrder, 150);
			}
		}
	}

	/*Gets specific cell by row and column*/
	function getCell(row, col) {
		return document.getElementById("cell-" + row + "-" + col);
	}

	/*Gets empty cell*/
	function getEmptyCell() {
		return puzzle.querySelector(".empty");
	}

	/*Gets empty adjacent cell if it exists*/
	function getEmptyAdjacentCell(cell) {
		var adjacent = getAdjacentCells(cell);

		for (var i = 0; i < adjacent.length; i++) {
			if (adjacent[i].classList.contains("empty")) {
				return adjacent[i];
			}
		}

		return null;
	}

	/*Gets all adjacent cells*/
	function getAdjacentCells(cell) {
		var id = cell.id.split("-");
		var row = parseInt(id[1]);
		var col = parseInt(id[2]);
		var adjacent = [];

		if (row < 3) adjacent.push(getCell(row + 1, col));
		if (row > 0) adjacent.push(getCell(row - 1, col));
		if (col < 3) adjacent.push(getCell(row, col + 1));
		if (col > 0) adjacent.push(getCell(row, col - 1));

		return adjacent;
	}

	/*Checks if the order of numbers is correct*/
	function checkOrder() {
		if (!getCell(3, 3).classList.contains("empty")) return;

		var n = 1;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (n <= 15 && getCell(i, j).innerHTML != n.toString()) {
					return;
				}
				n++;
			}
		}

		if (confirm("Congrats, You did it! \nScramble the puzzle?")) {
			scramble();
		}
	}

	/*Scrambles puzzle*/
	function scramble() {
		if (state == 0) return;

		puzzle.removeAttribute("class");
		state = 0;

		var moves = 100; // Number of random moves
		var previousCell;

		var interval = setInterval(function () {
			if (moves > 0) {
				var emptyCell = getEmptyCell();
				var adjacent = getAdjacentCells(emptyCell);

				if (previousCell) {
					adjacent = adjacent.filter((cell) => cell.id !== previousCell.id);
				}

				var randomCell = adjacent[rand(0, adjacent.length - 1)];
				previousCell = randomCell;

				shiftCell(randomCell);
				moves--;
			} else {
				clearInterval(interval);
				state = 1;
			}
		}, 50);
	}

	/*Generates random number*/
	function rand(from, to) {
		return Math.floor(Math.random() * (to - from + 1)) + from;
	}
})();
