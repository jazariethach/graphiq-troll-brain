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
var searchFor = GOLD;
var backTrace = [], stairsLeft = [];  // treat these arrays like stacks
var firstStep = true, holdingBlock = false;
var buildLevel = 1; // represents the stair level we are building

// Stacker's main function
this.turn = function(cell){
	currentCell = cell;

	if (firstStep) {
		firstStep = false;
		cellMap = this.createMap();
		this.ignoreWalls(cell);
	}

	// The 7th stair is placed, get that gold!
	if (buildLevel > 8) {
		return this.goUpStairs("up");
	}

	return this.dfsOnItem(cell, searchFor);
}

// Creates an nxn matrix to map the grid, cells initialized to false if unvisited
this.createMap = function() {
	newGrid = new Array(n);
	for(var i=0; i<n; i++) {
		newGrid[i] = new Array(n);
		for(var j=0; j<n; j++) {
			newGrid[i][j] = false;
		}
	}

	// If tower found, treat surrounding blocks as visited
	if (towerX != -1 && towerY != -1) {
		newGrid[(n+towerX-1)%n][towerY] = true; // left
		newGrid[towerX][(n+towerY-1)%n] = true;	// up
		newGrid[(n+towerX+1)%n][towerY] = true;	// right
		newGrid[towerX][(n+towerY+1)%n] = true;	// down
		
		newGrid[(n+towerX-1)%n][(n+towerY-1)%n] = true;	// left-up
		newGrid[(n+towerX+1)%n][(n+towerY-1)%n] = true;	// right-up
		newGrid[(n+towerX+1)%n][(n+towerY+1)%n] = true;	// right-down
		newGrid[(n+towerX-1)%n][(n+towerY+1)%n] = true;	// left down
	}

	return newGrid;
}

this.nextToItem = function(cell, item) {
	if (cell["left"]["type"] == item) {
		return "left";
	} else if (cell["up"]["type"] == item) {
		return "up";
	} else if (cell["right"]["type"] == item) {
		return "right";
	} else if (cell["down"]["type"] == item) {
		return "down";
	} else {
		return "";
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

this.takeStep = function(dir) {
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
			dir = "" 
			break;
	}
	return dir;
}

this.fillStairsLeft = function(currentLevel) {
	for(var i=currentLevel; i<8; i++) {
		stairsLeft.push(i);
	}
}

// The number stair you are standing on, 0 if on ground
// Stair layout: 
// |2 3 4|	
// |1 8 5|
// |  7 6|

this.getStairLevel = function() {
	if (x == (n+towerX-1)%n && y == towerY) {
		return 1;
	} else if (x == (n+towerX-1)%n && y == (n+towerY-1)%n) {
		return 2;
	} else if (x == towerX && y == (n+towerY-1)%n) {
		return 3;
	} else if (x == (n+towerX+1)%n && y == (n+towerY-1)%n) {
		return 4;
	} else if (x == (n+towerX+1)%n && y == towerY) {
		return 5;
	} else if (x == (n+towerX+1)%n && y == (n+towerY+1)%n) {
		return 6;
	} else if (x == towerX && y == (n+towerY+1)%n) {
		return 7;
	} else {
		return 0;
	}
}

this.goUpStairs = function() {
	var stairLevel = this.getStairLevel();
	if (stairLevel == 1) {
		return this.takeStep("up");
	} else if (stairLevel == 2) {
		return this.takeStep("right");
	} else if (stairLevel == 3) {
		return this.takeStep("right");
	} else if (stairLevel == 4) {
		return this.takeStep("down");
	} else if (stairLevel == 5) {
		return this.takeStep("down");
	} else if (stairLevel == 6) {
		return this.takeStep("left");
	} else if (stairLevel == 7) {
		// yasss gold is yours!
		return this.takeStep("up");
	} else {
		console.log("Error: Not near stairs to go up")
		return "";
	}
}

this.goDownStairs = function() {
	var stairLevel = this.getStairLevel();
	if (stairLevel == 7) {
		return this.takeStep("right");
	} else if (stairLevel == 6) {
		return this.takeStep("up");
	} else if (stairLevel == 5) {
		return this.takeStep("up");
	} else if (stairLevel == 4) {
		return this.takeStep("left");
	} else if (stairLevel == 3) {
		return this.takeStep("left");
	} else if (stairLevel == 2) {
		return this.takeStep("down");
	} else if (stairLevel == 1) {
		backTrace = [];
		backTrace.push("left");
		cellMap = this.createMap();
		return this.takeStep("left");
	}
}

this.dfsOnItem = function(cell, item){
	if (item == GOLD) {
		if (cell["left"]["type"] == GOLD) {
			towerX = (n+x-1)%n;
			towerY = y;
		} else if (cell["up"]["type"] == GOLD) {
			towerX = x;
			towerY = (n+y-1)%n;
		} else if (cell["right"]["type"] == GOLD) {
			towerX = (n+x+1)%n;
			towerY = y;
		} else if (cell["down"]["type"] == GOLD) {
			towerX = x;
			towerY = (n+y+1)%n;
		}

		// tower was found and clear steps to start looking for blocks
		if (this.nextToItem(cell, item) != "") {
			cellMap = this.createMap();
			backTrace = []; 
			searchFor = BLOCK;			
			this.fillStairsLeft(buildLevel);
			buildLevel++;
			return this.goDownStairs();
		}
	} else if (item == BLOCK) {
		var stairLevel = this.getStairLevel();
		if (stairLevel != 0) {
			if (!holdingBlock) {
				return this.goDownStairs();
			} else {
				var target = stairsLeft[stairsLeft.length-1];			
				
				if (target < stairLevel) {
					return this.goDownStairs();
				} else if (target > stairLevel) {
					return this.goUpStairs();
				} else {
					stairsLeft.pop();	// remove target stair from stairsLeft
					if (stairsLeft.length == 0) {
						this.fillStairsLeft(buildLevel);
						buildLevel++;
					}

					if (cell["type"] == BLOCK && cell["level"] == buildLevel-1) {
						return this.dfsOnItem(cell, BLOCK); 
					}

					holdingBlock = false;
					return "drop";
				}
			}
		}

		if (holdingBlock) {
			if (backTrace.length > 0) {
				return this.takeStep(this.getOppositeStep(backTrace.pop()));
			} 
		} else if (!holdingBlock && cell["type"] == BLOCK && stairLevel == 0) {
			cellMap = this.createMap();
			holdingBlock = true;
			return "pickup";
		}

	}

	if (!cellMap[x][y]) {
		cellMap[x][y] = true;
		this.ignoreWalls(cell);
	}

	var nextTo = this.nextToItem(cell, item);
	if (!holdingBlock && item == BLOCK && nextTo != "" && !this.isVisited(nextTo)) {
		backTrace.push(nextTo);
		return this.takeStep(nextTo);		
	}

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

}
