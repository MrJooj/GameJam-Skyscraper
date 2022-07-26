import { Tile } from "../tile.js";
import { Coordinates } from "../coordinates.js";
import { Sprite } from "../sprite/sprite.js"
import CubeSheet from "../../assets/mapSheet.json" assert {type: 'json'};
import TilesInfo from "../../scripts/sprite/tiles.json" assert { type: "json" };
export class Skyscraper {
    constructor(map, game, hud, keyboard) {
        this.map = map;
        this.game = game;
        this.hud = hud;
        this.keyboard = keyboard;

        this.cloudSprites = [CubeSheet.CloudBig1, CubeSheet.CloudBig2, CubeSheet.CloudBig3, CubeSheet.CloudBig4, CubeSheet.CloudSmall1, CubeSheet.CloudSmall2, CubeSheet.CloudSmall3]
        this.clouds = [];
        this.cloudsPos = [];
        this.startClouds();
    }

    startClouds(){
        for(let i = 0; i < 25; i++){
            this.clouds.push(new Sprite(this.cloudSprites[i % this.cloudSprites.length]));
            this.cloudsPos.push(new Coordinates(Math.floor(Math.random() * this.hud.canvas.width), 40 +  Math.floor(Math.random() * this.hud.canvas.height)));
        }

        setInterval(() => this.moveClouds(), 1420);
    }

    moveClouds(){
        for(let i = 0; i < this.cloudsPos.length; i++){
            if (Math.random() > 0.8){
                this.cloudsPos[i].x = this.cloudsPos[i].x + 8
            } else if (Math.random() > 0.8){
                this.cloudsPos[i].x = this.cloudsPos[i].x - 8;
            }
        }
    }

    drawClouds(){
        const ctx = this.map.isoCtx;
        for(let i = 0; i < this.clouds.length; i++){
            const cloud = this.clouds[i];
            ctx.drawImage(
                cloud.img,
                cloud.imgX,
                cloud.imgY,
                cloud.imgW,
                cloud.imgH,
                this.cloudsPos[i].x, this.cloudsPos[i].y,
                cloud.imgW, cloud.imgH
            );
        }
    }

    upgradeTile() {
        const x = Math.floor(this.map.selectedTile.coord.x);
        const y = Math.floor(this.map.selectedTile.coord.y);

        if (this.map.placed[y][x].color != '#9b9b9b') {
            return;
        }

        let toSend = this.hud.getSelectedBtnSprite();
        
        switch (toSend.color) {
            case '#d38f7e': this.game.worker +=1; break;
            case '#c8c59a': this.game.phone +=1; break;
            case '#831113': this.game.printer +=1; break;
            default: console.log(`Can't find match to ${toSend.color}`);
        }

        this.map.placed[y][x] = new Tile(new Coordinates(x, y), toSend);

    }

    updateFloor(){
        for (let y = 5; y < 11; y++) {
            for (let x = 5; x < 11; x++) {
                if (this.map.placed[y][x].color == '#9b9b9b') {
                    return true;
                }
            }
        }

       
        if (this.game.finishedDeals >= 50){
            this.game.finishedDeals -= 50;
            this.goToNextFloor();
        }
        
    }

    goToNextFloor() {
        this.map.game.resetTimer();
        this.map.game.floors++;

        for (let y = 0; y < this.map.placed.length; y++) {
            for (let x = 0; x < this.map.placed[y].length; x++) {
                this.map.placed[y][x] = new Tile(new Coordinates(x, y), TilesInfo.Invisible);
            }
        }

    }
}