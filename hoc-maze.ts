// %block="编程一小时" %groups='["走迷宫"]'
//% weight=100 color=#6699CC icon="\u2593"
namespace maze {

    export enum GameSpeed {
        //%block="正常速度"
        NORMAL = 1,
        //%block="较高速度"
        FAST = 4,
        //%block="最高速度"
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

    let _levelResults :summary.ProblemResult[] = []
    let _challengerName :string = '方块鸟'
    let _debugMode:false

    let runnerSprite : Sprite = null;
    const RUNNER_SPRITE_KIND = SpriteKind.create();

    let noPause :boolean = false;
    const DEFAULT_STEP_PAUSE_MILLIS = 500;

    let playSpeed : number = GameSpeed.NORMAL;

    let _mazeLevel:number = 1;
    let _currentDirection:CollisionDirection = CollisionDirection.Bottom;
    
    //地图修改
    const level1tilemap =tilemap`level`
    const level2tilemap =tilemap`level_0`
    const level3tilemap =tilemap`level_5`
    const level41tilemap =tilemap`level_1`
    const level42tilemap =tilemap`level_2`
    const level43tilemap =tilemap`level_3`
    const level44tilemap =tilemap`level_4`
    const level51tilemap =tilemap`level_6`
    const level52tilemap =tilemap`level_7`
    const level53tilemap =tilemap`level_8`
    const level54tilemap =tilemap`level_9`
    //随机关卡4、5
    function randomLevel(level:number){
        let ranNum = randint(0, 2)
        let ranTilemap 
        if(level==4){
            switch(ranNum){
                case 0:
                ranTilemap = level41tilemap
                break
                case 1:
                ranTilemap = level42tilemap
                break
                case 2:
                ranTilemap = level43tilemap
                break
            }
        }
        else{
            switch(ranNum){
                case 0:
                ranTilemap = level51tilemap
                break
                case 1:
                ranTilemap = level52tilemap
                break
                case 2:
                ranTilemap = level53tilemap
                break
            }
        }
        return ranTilemap
    }

    let levelTilemaps :tiles.TileMapData[] = [level1tilemap, level2tilemap,level3tilemap,randomLevel(4),randomLevel(5)];

    let levelCallbacks : (() => void) [] = [];
    //前方是否可以前进
    function directionAvailable(direction: CollisionDirection) {
       //let frontTileX = 0
       //let frontTileY = 0
       let frontTileXDelta = 0
       let frontTileYDelta = 0
       switch(direction){
           case CollisionDirection.Bottom:
           frontTileYDelta+=16
           break
           case CollisionDirection.Top:
           frontTileYDelta+=-16
           break
           case CollisionDirection.Left:
           frontTileXDelta+=-16
           break
           case CollisionDirection.Right:
           frontTileXDelta+=16
           break
        }
        let frontTileX = (frontTileXDelta+runnerSprite.x)/16
        let frontTileY = (frontTileYDelta+runnerSprite.y)/16

        if(tiles.tileAtLocationEquals(tiles.getTileLocation(frontTileX, frontTileY), img`
            b d d d d d d d d d d d d d d c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            d b b b b b b b b b b b b b b c
            c c c c c c c c c c c c c c c a
        `)||tiles.tileAtLocationEquals(tiles.getTileLocation(frontTileX, frontTileY), img`
            6 6 6 c c 6 6 6 6 6 6 c c 6 6 6
            7 7 7 7 c 7 7 7 7 7 7 7 c 7 7 7
            7 7 7 6 c 7 7 7 7 7 7 7 c 7 7 7
            6 6 6 6 c 6 6 6 6 6 6 6 c c 6 6
            c c c c c c c c c c c c c c c c
            c 6 7 7 7 7 7 6 c 6 7 7 7 7 7 6
            c c 6 6 6 6 6 6 c c 6 6 6 6 6 6
            c c c c c c c c c c c c c c c c
            6 6 6 c 6 6 6 6 6 6 6 6 c 6 6 6
            6 6 6 c c 6 6 6 6 6 6 6 c 6 6 6
            c c c c c c c c c c c c c c c c
            c 6 6 6 6 6 6 c c 6 6 6 6 6 6 c
            c c c c c c c c c c c c c c c c
            6 6 c c 6 6 6 6 6 6 c c 6 6 6 6
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
        `)||tiles.tileAtLocationEquals(tiles.getTileLocation(frontTileX, frontTileY), img`
            c c c c c c c c c c c c c c c c
            c c c c c c c c c c c c c c c c
            6 6 6 6 c c 6 6 6 6 6 6 c c 6 6
            c c c c c c c c c c c c c c c c
            c 6 6 6 6 6 6 c c 6 6 6 6 6 6 c
            c c c c c c c c c c c c c c c c
            6 6 6 c 6 6 6 6 6 6 6 c c 6 6 6
            6 6 6 c 6 6 6 6 6 6 6 6 c 6 6 6
            c c c c c c c c c c c c c c c c
            6 6 6 6 6 6 c c 6 6 6 6 6 6 c c
            6 7 7 7 7 7 6 c 6 7 7 7 7 7 6 c
            c c c c c c c c c c c c c c c c
            6 6 c c 6 6 6 6 6 6 6 c 6 6 6 6
            7 7 7 c 7 7 7 7 7 7 7 c 6 7 7 7
            7 7 7 c 7 7 7 7 7 7 7 c 7 7 7 7
            6 6 6 c c 6 6 6 6 6 6 c c 6 6 6
        `)||tiles.tileAtLocationEquals(tiles.getTileLocation(frontTileX, frontTileY), img`
            6 7 7 6 c 6 6 c 6 6 c c c 6 c c
            6 7 7 6 c 7 6 c 6 6 c 6 c 6 c c
            6 7 7 c c 7 6 c 6 6 c 6 c 6 c c
            c c c c c 7 6 c c c c 6 c 6 c c
            c 7 7 6 c 7 6 c 6 6 c 6 c c c c
            6 7 7 6 c 7 6 c 6 6 c 6 c c c c
            6 7 7 6 c 6 c c 6 6 c 6 c 6 c c
            6 7 7 6 c c c c 6 6 c c c 6 c c
            6 7 7 6 c 6 6 c 6 6 c c c 6 c c
            6 7 7 6 c 7 6 c 6 6 c 6 c 6 c c
            6 7 7 6 c 7 6 c 6 6 c 6 c 6 c c
            c c c c c 7 6 c 6 c c 6 c 6 c c
            c 7 6 6 c 7 6 c c c c 6 c c c c
            6 7 7 6 c 7 6 c 6 6 c 6 c c c c
            6 7 7 6 c 6 c c 6 6 c 6 c 6 c c
            6 7 7 6 c c c c 6 6 c c c 6 c c
        `)||tiles.tileAtLocationEquals(tiles.getTileLocation(frontTileX, frontTileY), img`
            c c 6 c c c 6 6 c c c c 6 7 7 6
            c c 6 c 6 c 6 6 c c 6 c 6 7 7 6
            c c c c 6 c 6 6 c 6 7 c 6 7 7 6
            c c c c 6 c c c c 6 7 c 6 6 7 c
            c c 6 c 6 c c 6 c 6 7 c c c c c
            c c 6 c 6 c 6 6 c 6 7 c 6 7 7 6
            c c 6 c 6 c 6 6 c 6 7 c 6 7 7 6
            c c 6 c c c 6 6 c 6 6 c 6 7 7 6
            c c 6 c c c 6 6 c c c c 6 7 7 6
            c c 6 c 6 c 6 6 c c 6 c 6 7 7 6
            c c c c 6 c 6 6 c 6 7 c 6 7 7 6
            c c c c 6 c 6 6 c 6 7 c 6 7 7 c
            c c 6 c 6 c c c c 6 7 c c c c c
            c c 6 c 6 c 6 6 c 6 7 c c 7 7 6
            c c 6 c 6 c 6 6 c 6 7 c 6 7 7 6
            c c 6 c c c 6 6 c 6 6 c 6 7 7 6
        `)){
            return false
            }
        else  return true
    }   

    //% block="我是 %name, 将速度设定 %speed" weight="2000"
    export function startGame(name:string, speed:GameSpeed) {
        _challengerName = name
        playSpeed = speed
    }

    //% block="当进入第一关" weight="500"
    export function onLevelOne(cb:()=>void) {
        levelCallbacks.set(0, cb)
    }

    //% block="当进入第二关" weight="400"
    export function onLevelTwo(cb:()=>void) {
        levelCallbacks.set(1, cb)
    }
    //% block="当进入第三关" weight="300"
    export function onLevelThree(cb:()=>void) {
        levelCallbacks.set(2, cb)
    }
    //% block="当进入第四关" weight="200"
    export function onLevelFour(cb:()=>void) {
        levelCallbacks.set(3, cb)
    }
    //% block="当进入第五关" weight="100"
    export function onLevelFive(cb:()=>void) {
        levelCallbacks.set(4, cb)
    }

    function pauseImpl(millis : number) {
        if (noPause) {
            return 
        }
        pause(millis / playSpeed)
    }

    
    function finishedCurrentLevel() {
        levelFinished = true
    }

    function runnerLoading() {
        let word = "loading"
        for (let i = 0; i < 6; i++) {
            word += "."
            runnerSprite.say(word)
            pauseImpl(200)
            if (i == 2) {
                word = "loading"
            }    
        }
    }

    let levelFinished :boolean = false;

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
        } else {
            runnerSprite.say("")
            runnerSprite.setImage(img`
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
            `)
        }

        _currentDirection = CollisionDirection.Bottom
        
        tiles.setTilemap(levelTilemaps[level - 1])
        tiles.placeOnRandomTile(runnerSprite, sprites.dungeon.stairNorth)

        runnerLoading()

        if (levelCallbacks[level - 1] == null) {
            runnerSprite.say("第" + level + "关的程序载入失败")
            pauseImpl(2000)
            runnerSprite.say("请在'当进入第" + level + "关'内写好程序")
            pauseImpl(5000)
        } else {
            runnerSprite.say("开始按程序运行")        
            pauseImpl(1000)

            levelCallbacks[level-1]()

            if (!levelFinished) {           
                runnerSprite.say("没有指令了，不知道接下来要做什么")
                pauseImpl(1000)
                _levelResults.push({
                    line:"Level " + level,
                    isCorrect:false,
                    oneline:true
                })
                levelFinished = true
            } else {
                _levelResults.push({
                    line:"Level " + level,
                    isCorrect:true,
                    oneline:true
                })
            }
        }
    }

    //朝向前进
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
    
    //% block="左转" weight="1900"
    export function turnLeft() {
        if (_currentDirection == CollisionDirection.Top) {
            _currentDirection = CollisionDirection.Left
            runnerSprite.setImage(LEFT.spriteImage)
        } else if (_currentDirection == CollisionDirection.Left) {
            _currentDirection = CollisionDirection.Bottom
            runnerSprite.setImage(DOWN.spriteImage)
        } else if (_currentDirection == CollisionDirection.Bottom) {
            _currentDirection = CollisionDirection.Right
            runnerSprite.setImage(RIGHT.spriteImage)
        } else {
            _currentDirection = CollisionDirection.Top
            runnerSprite.setImage(UP.spriteImage)
        }
        runnerSprite.say('左转')
        pauseImpl(DEFAULT_STEP_PAUSE_MILLIS)
    }

    //% block="右转" weight="1800"
    export function turnRight() {
        if (_currentDirection == CollisionDirection.Top) {
            _currentDirection = CollisionDirection.Right
            runnerSprite.setImage(RIGHT.spriteImage)
        } else if (_currentDirection == CollisionDirection.Right) {
            _currentDirection = CollisionDirection.Bottom
            runnerSprite.setImage(DOWN.spriteImage)
        } else if (_currentDirection == CollisionDirection.Bottom) {
            _currentDirection = CollisionDirection.Left
            runnerSprite.setImage(LEFT.spriteImage)
        } else {
            _currentDirection = CollisionDirection.Top
            runnerSprite.setImage(UP.spriteImage)
        }
        runnerSprite.say('右转')
        pauseImpl(DEFAULT_STEP_PAUSE_MILLIS)
    }

    //% block="前进" weight="1700"
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

    let isNavigationMode = true
    let needIntroduction = true

    let _navigatingLevel = 0
    const START_POINT_SPRITE_IN_NAVI_SPRITE_KIND = SpriteKind.create()

    function destroyAllNaviSprites() {
        for (let sprite of sprites.allOfKind(START_POINT_SPRITE_IN_NAVI_SPRITE_KIND)) {
            sprite.destroy()
        }
    }

    let navigatingTimestamp = 0

    function navigateLevel(level : number) {
        settings.writeNumber("navigatingLevel", level)
        destroyAllNaviSprites()
        let startPointSprite = sprites.create(img`
            . . . . . . 5 . 5 . . . . . . .
            . . . . . f 5 5 5 f f . . . . .
            . . . . f 1 5 2 5 1 6 f . . . .
            . . . f 1 6 6 6 6 6 1 6 f . . .
            . . . f 6 6 f f f f 6 1 f . . .
            . . . f 6 f f d d f f 6 f . . .
            . . f 6 f d f d d f d f 6 f . .
            . . f 6 f d 3 d d 3 d f 6 f . .
            . . f 6 6 f d d d d f 6 6 f . .
            . f 6 6 f 3 f f f f 3 f 6 6 f .
            . . f f d 3 5 3 3 5 3 d f f . .
            . . f d d f 3 5 5 3 f d d f . .
            . . . f f 3 3 3 3 3 3 f f . . .
            . . . f 3 3 5 3 3 5 3 3 f . . .
            . . . f f f f f f f f f f . . .
            . . . . . f f . . f f . . . . .
        `, START_POINT_SPRITE_IN_NAVI_SPRITE_KIND)
        tiles.setTilemap(levelTilemaps[level])

        tiles.placeOnRandomTile(startPointSprite, sprites.dungeon.stairNorth)

        if (needIntroduction) {
            needIntroduction = false
            game.splash("按左右方向键切换浏览关卡")
            game.splash("按menu开始正式挑战")
        }

        navigatingTimestamp = game.runtime()
        
        game.splash("第" + (level+1).toString() + "关地图")
    }

    // 万一用户不记得如何操作，每隔10秒告诉他一下menu可以开始挑战
    forever(function() {
        if (isNavigationMode) {
            if (game.runtime() - navigatingTimestamp > 10000) {
                game.splash("按左右方向键切换浏览关卡")
                game.splash("按menu开始正式挑战")   
                navigatingTimestamp = game.runtime()     
            }
        }
        pause(100)
    })

    controller.left.onEvent(ControllerButtonEvent.Pressed, function(){
        if (_navigatingLevel > 0) {
            _navigatingLevel -= 1
            navigateLevel(_navigatingLevel)
        }
    })

    controller.right.onEvent(ControllerButtonEvent.Pressed, function(){
        if (_navigatingLevel < levelTilemaps.length - 1) {
            _navigatingLevel += 1
            navigateLevel(_navigatingLevel)
        }
    })

    controller.menu.onEvent(ControllerButtonEvent.Pressed, function(){
        if (!isNavigationMode) {
            return
        }
        if (game.ask("开始挑战")) {
            isNavigationMode = false
            destroyAllNaviSprites()
        }
    })

    control.runInParallel(function() {
        summary.introScreen(1000)

        if (settings.exists("navigatingLevel")) {
            _navigatingLevel = settings.readNumber("navigatingLevel") 
        }
        navigateLevel(_navigatingLevel)
        while(isNavigationMode) {
            pause(100)
        }
        initMaze(_mazeLevel)    

        while (_mazeLevel != levelTilemaps.length) {
            _mazeLevel += 1
            levelFinished = false
            initMaze(_mazeLevel)
            while(!levelFinished) ;
        }

        summary.setUpSummaryScene(_challengerName, img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . 1 1 1 1 1 1 1 1 1 1 . . .
            . . 1 4 4 4 4 4 4 4 4 4 1 . . .
            . 1 5 4 4 4 4 4 4 4 4 4 1 . . .
            1 5 5 4 4 f f 4 4 1 1 1 1 1 1 1
            5 5 5 4 4 f f 4 4 5 5 5 5 5 5 .
            . . . 4 4 4 4 4 4 5 5 5 5 5 . .
            . . . 4 4 4 4 4 4 5 5 5 5 . . .
            . . . 4 4 4 4 4 4 5 5 5 1 . . .
            . . . 4 4 4 4 4 4 5 5 4 1 . . .
            . . . 4 4 4 4 4 4 5 4 4 1 . . .
            . . . 9 9 9 7 7 7 7 7 7 1 . . .
            . . . . 9 9 7 7 7 7 7 7 1 . . .
            . . . . . 9 7 7 7 7 7 7 1 . . .
            . . . . . . . . . . . . . . . .
        `)
        summary.textUp(_levelResults)
    })
    
}
