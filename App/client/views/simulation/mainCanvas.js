/**
 * Created by antoinelavail on 07/05/2014.
 */
mainCanvas = function(element, config){
    this.config=config;
    this.GOL;
    this.btn_switchMode;
    this.phaser = new Phaser.Game(config.grid.width+200, config.grid.height, Phaser.CANVAS, element, this);
};

mainCanvas.prototype = {

    preload : function(){
        this.GOL = new GOL(this.config,this);
        this.phaser.load.image('cell','assets/cell.png');
        this.phaser.load.spritesheet('iteratif_parallel', 'assets/buttons/iteratif_parallel.png', 193, 71);
    },

    actionOnSwitchMode : function() {
        console.log("Caca");
    },

    create : function(){
        this.GOL.create();

        this.btn_switchMode = this.phaser.add.button(805, 10, 'iteratif_parallel', this.actionOnSwitchMode, this, 0,1,2);
    },

    update : function () {
       this.GOL.update();
    },

    render: function (){
        //this.phaser.debug.text("fps : " + Math.floor(1000/this.phaser.time.elapsed), 32, 32);
        this.GOL.render();
    },

    destroy : function(){
        this.destroy();
    }
}