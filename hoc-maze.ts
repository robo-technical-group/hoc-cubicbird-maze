// %block="编程一小时" %groups='["走迷宫"]'
//% weight=100 color=#6699CC icon="\u2593"
namespace maze {

    export enum GameSpeed {
        NORMAL = 1,
        FAST = 4,
        FASTER = 16
    }

    interface DirectionMeta {
        deltaX :number
        deltaY :number
        infoString:string
        spriteImage:Image
    }

    const UP = {
        deltaX : 0,
        deltaY : -16,
        infoString : "上",
        spriteImage:img`
            . . . . . . f f f f . . . . . .
            . . . . f f e e e e f f . . . .
            . . . f e e e f f e e e f . . .
            . . f f f f f 2 2 f f f f f . .
            . . f f e 2 e 2 2 e 2 e f f . .
            . . f e 2 f 2 f f 2 f 2 e f . .
            . . f f f 2 2 e e 2 2 f f f . .
            . f f e f 2 f e e f 2 f e f f .
            . f e e f f e e e e f e e e f .
            . . f e e e e e e e e e e f . .
            . . . f e e e e e e e e f . . .
            . . e 4 f f f f f f f f 4 e . .
            . . 4 d f 2 2 2 2 2 2 f d 4 . .
            . . 4 4 f 4 4 4 4 4 4 f 4 4 . .
            . . . . . f f f f f f . . . . .
            . . . . . f f . . f f . . . . .
        `  
    }

    const RIGHT = {
        deltaX : 16,
        deltaY : 0,
        infoString : "右",
        spriteImage:img`
            . . . . . . f f f f f f . . . .
            . . . . f f e e e e f 2 f . . .
            . . . f f e e e e f 2 2 2 f . .
            . . . f e e e f f e e e e f . .
            . . . f f f f e e 2 2 2 2 e f .
            . . . f e 2 2 2 f f f f e 2 f .
            . . f f f f f f f e e e f f f .
            . . f f e 4 4 e b f 4 4 e e f .
            . . f e e 4 d 4 1 f d d e f . .
            . . . f e e e 4 d d d d f . . .
            . . . . f f e e 4 4 4 e f . . .
            . . . . . 4 d d e 2 2 2 f . . .
            . . . . . e d d e 2 2 2 f . . .
            . . . . . f e e f 4 5 5 f . . .
            . . . . . . f f f f f f . . . .
            . . . . . . . f f f . . . . . .
        `  
    }

    const DOWN = {
        deltaX : 0,
        deltaY : 16,
        infoString : "下",
        spriteImage:img`
            . . . . . . f f f f . . . . . .
            . . . . f f f 2 2 f f f . . . .
            . . . f f f 2 2 2 2 f f f . . .
            . . f f f e e e e e e f f f . .
            . . f f e 2 2 2 2 2 2 e e f . .
            . . f e 2 f f f f f f 2 e f . .
            . . f f f f e e e e f f f f . .
            . f f e f b f 4 4 f b f e f f .
            . f e e 4 1 f d d f 1 4 e e f .
            . . f e e d d d d d d e e f . .
            . . . f e e 4 4 4 4 e e f . . .
            . . e 4 f 2 2 2 2 2 2 f 4 e . .
            . . 4 d f 2 2 2 2 2 2 f d 4 . .
            . . 4 4 f 4 4 5 5 4 4 f 4 4 . .
            . . . . . f f f f f f . . . . .
            . . . . . f f . . f f . . . . .
        `  
    }

    const LEFT = {
        deltaX : -16,
        deltaY : 0,
        infoString : "左",
        spriteImage:img`
            . . . . f f f f f f . . . . . .
            . . . f 2 f e e e e f f . . . .
            . . f 2 2 2 f e e e e f f . . .
            . . f e e e e f f e e e f . . .
            . f e 2 2 2 2 e e f f f f . . .
            . f 2 e f f f f 2 2 2 e f . . .
            . f f f e e e f f f f f f f . .
            . f e e 4 4 f b e 4 4 e f f . .
            . . f e d d f 1 4 d 4 e e f . .
            . . . f d d d d 4 e e e f . . .
            . . . f e 4 4 4 e e f f . . . .
            . . . f 2 2 2 e d d 4 . . . . .
            . . . f 2 2 2 e d d e . . . . .
            . . . f 5 5 4 f e e f . . . . .
            . . . . f f f f f f . . . . . .
            . . . . . . f f f . . . . . . .
        `  
    }

    let runnerSprite : Sprite = null;
    const RUNNER_SPRITE_KIND = SpriteKind.create();

    let noPause :boolean = false;
    const DEFAULT_STEP_PAUSE_MILLIS = 1000;

    let playSpeed : number = GameSpeed.NORMAL;

    let _mazeLevel:number = 1;
    let _currentDirection:CollisionDirection = CollisionDirection.Bottom;

    let levelTilemaps :tiles.TileMapData[] = [tilemap`level`];

    let levelCallbacks : (() => void) [] = [];

    function directionAvailable(direction: CollisionDirection) {
        return true
    }   

    //% block
    export function setSpeed(speed:GameSpeed) {
        playSpeed = speed
    }

    //% block="当进入第一关"
    export function onLevelOne(cb:()=>void) {
        levelCallbacks[0] = cb
    }

    function pauseImpl(millis : number) {
        if (noPause) {
            return 
        }
        pause(millis / playSpeed)
    }

    
    function finishedCurrentLevel() {
        if (_mazeLevel == levelTilemaps.length) {
            game.over(true)
        } else {
            _mazeLevel += 1
            initMaze(_mazeLevel)
        }
    }

    function initMaze(level:number) {
        if (runnerSprite == null) {
            runnerSprite = sprites.create(img`
                . . . . . . f f f f . . . . . .
                . . . . f f f 2 2 f f f . . . .
                . . . f f f 2 2 2 2 f f f . . .
                . . f f f e e e e e e f f f . .
                . . f f e 2 2 2 2 2 2 e e f . .
                . . f e 2 f f f f f f 2 e f . .
                . . f f f f e e e e f f f f . .
                . f f e f b f 4 4 f b f e f f .
                . f e e 4 1 f d d f 1 4 e e f .
                . . f e e d d d d d d e e f . .
                . . . f e e 4 4 4 4 e e f . . .
                . . e 4 f 2 2 2 2 2 2 f 4 e . .
                . . 4 d f 2 2 2 2 2 2 f d 4 . .
                . . 4 4 f 4 4 5 5 4 4 f 4 4 . .
                . . . . . f f f f f f . . . . .
                . . . . . f f . . f f . . . . .
            `, RUNNER_SPRITE_KIND)
        }
        
        tiles.setTilemap(levelTilemaps[level - 1])
        tiles.placeOnRandomTile(runnerSprite, sprites.dungeon.stairNorth)

        levelCallbacks[level-1]()
    }


    function moveInDirection(direction:CollisionDirection) {
        let directionMeta :DirectionMeta = null
        switch(direction) {
            case CollisionDirection.Top:
                directionMeta = UP; 
                break;
            case CollisionDirection.Right:
                directionMeta = RIGHT; 
                break;
            case CollisionDirection.Bottom:
                directionMeta = DOWN; 
                break;
            case CollisionDirection.Left:
                directionMeta = LEFT; 
                break;
        }

        runnerSprite.x += directionMeta.deltaX
        runnerSprite.y += directionMeta.deltaY

        runnerSprite.setImage(directionMeta.spriteImage)

        runnerSprite.say('前进')        
    }
    
    //% block="左转"
    export function turnLeft() {
        if (_currentDirection == CollisionDirection.Top) {
            _currentDirection = CollisionDirection.Left
        } else if (_currentDirection == CollisionDirection.Left) {
            _currentDirection = CollisionDirection.Bottom
        } else if (_currentDirection == CollisionDirection.Bottom) {
            _currentDirection = CollisionDirection.Right
        } else {
            _currentDirection = CollisionDirection.Top
        }
        runnerSprite.say('左转')
        pauseImpl(DEFAULT_STEP_PAUSE_MILLIS)
    }

    //% block="右转"
    export function turnRight() {
        if (_currentDirection == CollisionDirection.Top) {
            _currentDirection = CollisionDirection.Right
        } else if (_currentDirection == CollisionDirection.Right) {
            _currentDirection = CollisionDirection.Bottom
        } else if (_currentDirection == CollisionDirection.Bottom) {
            _currentDirection = CollisionDirection.Left
        } else {
            _currentDirection = CollisionDirection.Top
        }
        runnerSprite.say('右转')
        pauseImpl(DEFAULT_STEP_PAUSE_MILLIS)
    }

    //% block="前进"
    export function forward() {
        if (directionAvailable(_currentDirection)) {
            moveInDirection(_currentDirection)                
        } else {
            runnerSprite.say("我撞墙了")
        }
        pauseImpl(DEFAULT_STEP_PAUSE_MILLIS)
    }


    scene.onOverlapTile(RUNNER_SPRITE_KIND, sprites.dungeon.doorOpenNorth, function (sprite, location) {
        finishedCurrentLevel()
    })

    control.runInParallel(function() {
        while(levelCallbacks.length == 0) {
            
        }
        initMaze(_mazeLevel)    
    })
    

}
