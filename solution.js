// Traveling Salesman like problem? DFS to find blocks!
// Path finding and graph exploration

// cell = {
// 				left: {type: someValue, level: someValue},
// 				up: {type: someValue, level: someValue},
// 				right: {type: someValue, level: someValue},
// 				down: {type: someValue, level: someValue},
// 				type: someValue,
// 				level: someValue
// 			}

// Board is a 16x16 matrix


function Stacker(){

var
EMPTY = 0,
WALL = 1,
BLOCK = 2,
GOLD = 3;



// Replace this with your own wizardry
// SO MUCH WIZARD

var x = 0, y = 0, n = 16;
var towerX = -1, towerY = -1;
var directions = ["left", "up", "right", "down"];
var cellMap = null, currentCell = null, currentDir = null;
var backTrace = []; // treat this array like a stack
// var backTrace = new Array();
var firstStep = true;

// Creates an nxn matrix to map the grid, cells initialized to false if unvisited
// include the walls and set their value to -1?
this.createMap = function() {
	cellMap = new Array(n);
	for(var i=0; i<n; i++) {
		cellMap[i] = new Array(n);
		for(var j=0; j<n; j++) {
				cellMap[i][j] = false;
		}
	}
}

this.nextToItem = function(cell, item) {
	if (cell["left"]["type"] == item || cell["up"]["type"] == item || 
		cell["right"]["type"] == item || cell["down"]["type"] == item) {
		console.log("Next to item: " + item);
		return true;
	} else {
		return false;
	}
}

this.ignoreWalls = function(cell) {
	if (cell["left"]["type"] == WALL){
		cellMap[(n+x-1)%n][y] = true;
	} 
	if (cell["up"]["type"] == WALL) {
		cellMap[x][(n+y-1)%n] = true;
	}
	if (cell["right"]["type"] == WALL) {
		cellMap[(n+x+1)%n][y] = true;
	}
	if (cell["down"]["type"] == WALL) {
		cellMap[x][(n+y+1)%n] = true;
	}
}

this.isVisited = function(dir) {
	var check = true;
	switch(dir) {
		case "left":
			check = cellMap[(n+x-1)%n][y];
			break;
		case "up":
			check = cellMap[x][(n+y-1)%n];
			break;
		case "right":
			check = cellMap[(n+x+1)%n][y];		
			break;
		case "down":
			check = cellMap[x][(n+y+1)%n];
			break;
		default:
			console.log("Incorrect direction given: " + dir);
			break;
	}
	return check;
}

// Helper function for backtacing steps
this.getOppositeStep = function(dir) {
	var opposite = "";
	switch(dir) {
		case "left":
			opposite = "right";
			break;
		case "up":
			opposite = "down";
			break;
		case "right":
			opposite = "left";
			break;
		case "down":
			opposite = "up";
			break;
		default:
			console.log("Incorrect direction given: " + dir);
			break;
	}
	return opposite;
}

this.takeStep = function(dir){
	switch(dir) {
		case "left":
			x = (n+x-1)%n;
			break;
		case "up":
			y = (n+y-1)%n;
			break;
		case "right":
			x = (n+x+1)%n;
			break;
		case "down":
			y = (n+y+1)%n;
			break;
		default:
			console.log("Incorrect direction given: " + dir);
			dir = "" // should I default to 'drop' to waste the turn?
			break;
	}
	return dir;
}

this.dfsOnItem = function(cell, item){
	
	if (item == GOLD) {
		if (cell["left"]["type"] == GOLD) {
			towerX = (n+x-1)%n;
			towerY = y;
		} else if (cell["up"]["type"] == GOLD) {
			towerX = x;
			towerY = (n+y-1)%y;
		} else if (cell["right"]["type"] == GOLD) {
			towerX = (n+x+1)%n;
			towerY = y;
		} else if (cell["down"]["type"] == WALL) {
			towerX = x;
			towerY = (n+y+1)%y;
		}
		if(this.nextToItem(cell, item)){
			return "drop";
		}
	}

	cellMap[x][y] = true;
	this.ignoreWalls(cell);
	var dir = null;
	for(var i=0; i<directions.length; i++) {
		dir = directions[i];
		if (!this.isVisited(dir)) {
			backTrace.push(dir);
			return this.takeStep(dir);
		}
	}
	return this.takeStep(this.getOppositeStep(backTrace.pop()));
}

this.turn = function(cell){
	currentCell = cell;

	if (firstStep) {
		firstStep = false;
		this.createMap();
		this.ignoreWalls(cell);
	}

	return this.dfsOnItem(cell, GOLD);
	// Pick an action randomly
	// var n = Math.random() * 6 >> 0;
	// if (n == 0) return "left";
	// if (n == 1) return "up";
	// if (n == 2) return "right";
	// if (n == 3) return "down";
	// if (n == 4) return "pickup";
	// if (n == 5) return "drop";
}

// More wizardry here
// EVEN MORE WIZARD

}


