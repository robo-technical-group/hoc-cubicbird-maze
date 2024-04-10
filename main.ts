/**
 * main.ts
 */
/**
 * Guide our princess out of dungeon by giving her instructions.
 * 
 * Can interact with maze item using instructions under 'Maze'
 */
// Write level code here.
maze.onLevelOne(function () {
    for (let index = 0; index < 5; index++) {
        maze.forward()
    }
    maze.turnLeft()
    for (let index = 0; index < 7; index++) {
        maze.forward()
    }
})
maze.onLevelThree(function () {
	
})
maze.onLevelFour(function () {
	
})
maze.onLevelFive(function () {
	
})
maze.onLevelTwo(function () {
	
})
maze.setLanguage(maze.Language.ENGLISH)
maze.startGame("felixtsu", maze.GameSpeed.NORMAL)
// Run certain level in test mode .Super useful when writing level code.
maze.debugGame(maze.Level.ONE)
