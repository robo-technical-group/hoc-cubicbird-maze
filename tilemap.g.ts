// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);

    helpers.registerTilemapFactory(function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level": return tiles.createTilemap(hex`0a00080001020202020202020203060b0909090909090908060c0909090909090908060c0909090909090908060c0909090909090908060c0909090909090908060d0e0e0e0e0e0e0a0805070707070707070704`, img`
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
`, [myTiles.transparency16,sprites.dungeon.greenOuterNorthWest,sprites.dungeon.greenOuterNorth0,sprites.dungeon.greenOuterNorthEast,sprites.dungeon.greenOuterSouthWest,sprites.dungeon.greenOuterSouthEast,sprites.dungeon.greenOuterWest0,sprites.dungeon.greenOuterSouth1,sprites.dungeon.greenOuterEast0,sprites.dungeon.floorLight2,sprites.dungeon.doorOpenNorth,sprites.dungeon.stairNorth,myTiles.tile2,myTiles.tile3,myTiles.tile4], TileScale.Sixteen)
            case "level_0": return tiles.createTilemap(hex`0a00080001030303030303030304050b0a0a0a0a0a0a0a06050a0a0a0a0a0a0a0a06050a0a0a0a0a0a0a0a06050a0a0a0a0a0a0a0a06050a0a0a0a0a0a0a0a06050a0a0a0a0a0a0a090602080808080808080807`, img`
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
`, [myTiles.transparency16,sprites.dungeon.purpleOuterNorthWest,sprites.dungeon.purpleOuterSouthEast,sprites.dungeon.purpleOuterNorth0,sprites.dungeon.purpleOuterNorthEast,sprites.dungeon.purpleOuterWest0,sprites.dungeon.purpleOuterEast1,sprites.dungeon.purpleOuterSouthWest,sprites.dungeon.purpleOuterSouth1,sprites.dungeon.doorOpenNorth,sprites.dungeon.floorLight2,sprites.dungeon.stairNorth], TileScale.Sixteen)
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
