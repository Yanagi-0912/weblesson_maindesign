(function () {
	var state = 1;
	var puzzle = document.getElementById('puzzle');

	// Creates solved puzzle
	solve();

	// Listens for click on puzzle cells
	puzzle.addEventListener('click', function (e) {
		if (state === 1) {
			puzzle.className = 'animate';
			shiftCell(e.target);
		}
	});

	// Listens for click on control buttons
	document.getElementById('solve').addEventListener('click', solve);
	document.getElementById('scramble').addEventListener('click', scramble);

	// Creates solved puzzle
	function solve() {
		if (state === 0) {
			return;
		}

		puzzle.innerHTML = '';

		var n = 1;
		for (var i = 0; i <= 1; i++) {
			for (var j = 0; j <= 1; j++) {
				var cell = document.createElement('span');
				cell.id = 'cell-' + i + '-' + j;
				cell.style.left = j * 75 + 'px';
				cell.style.top = i * 75 + 'px';

				if (n <= 3) {
					cell.classList.add('number');
					cell.classList.add((i + j) % 2 === 0 ? 'light' : 'dark');
					cell.innerHTML = (n++).toString();
				} else {
					cell.className = 'empty';
				}

				puzzle.appendChild(cell);
			}
		}
	}

	// Shifts number cell to the empty cell
	function shiftCell(cell) {
		if (cell.className !== 'empty') {
			var emptyCell = getEmptyAdjacentCell(cell);

			if (emptyCell) {
				var tmp = { style: cell.style.cssText, id: cell.id };
				cell.style.cssText = emptyCell.style.cssText;
				cell.id = emptyCell.id;
				emptyCell.style.cssText = tmp.style;
				emptyCell.id = tmp.id;

				if (state === 1) {
					setTimeout(checkOrder, 150);
				}
			}
		}
	}

	// Gets specific cell by row and column
	function getCell(row, col) {
		return document.getElementById('cell-' + row + '-' + col);
	}

	// Gets empty cell
	function getEmptyCell() {
		return puzzle.querySelector('.empty');
	}

	// Gets empty adjacent cell if it exists
	function getEmptyAdjacentCell(cell) {
		var adjacent = getAdjacentCells(cell);

		for (var i = 0; i < adjacent.length; i++) {
			if (adjacent[i].className === 'empty') {
				return adjacent[i];
			}
		}
		return false;
	}

	// Gets all adjacent cells
	function getAdjacentCells(cell) {
		var id = cell.id.split('-');
		var row = parseInt(id[1]);
		var col = parseInt(id[2]);
		var adjacent = [];

		if (row < 1) adjacent.push(getCell(row + 1, col));
		if (row > 0) adjacent.push(getCell(row - 1, col));
		if (col < 1) adjacent.push(getCell(row, col + 1));
		if (col > 0) adjacent.push(getCell(row, col - 1));

		return adjacent;
	}

	// Checks if the order of numbers is correct
	function checkOrder() {
		if (getCell(1, 1).className !== 'empty') {
			return;
		}

		var n = 1;
		for (var i = 0; i <= 1; i++) {
			for (var j = 0; j <= 1; j++) {
				if (n <= 3 && getCell(i, j).innerHTML !== n.toString()) {
					return;
				}
				n++;
			}
		}

		if (confirm('Congrats, You did it! \nScramble the puzzle?')) {
			scramble();
		}
	}

	// Scrambles puzzle
	function scramble() {
		if (state === 0) {
			return;
		}

		puzzle.removeAttribute('class');
		state = 0;

		var previousCell;
		var i = 1;
		var interval = setInterval(function () {
			if (i <= 50) {
				var adjacent = getAdjacentCells(getEmptyCell());
				if (previousCell) {
					for (var j = adjacent.length - 1; j >= 0; j--) {
						if (adjacent[j].innerHTML === previousCell.innerHTML) {
							adjacent.splice(j, 1);
						}
					}
				}
				previousCell = adjacent[rand(0, adjacent.length - 1)];
				shiftCell(previousCell);
				i++;
			} else {
				clearInterval(interval);
				state = 1;
			}
		}, 50);
	}

	// Generates random number
	function rand(from, to) {
		return Math.floor(Math.random() * (to - from + 1)) + from;
	}
})();
