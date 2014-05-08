/**
 * Created by antoinelavail on 07/05/2014.
 */
mainCanvas = function(element, config){
    this.config=config;
    this.GOL;
    this.btn_switchMode;
    this.btn_launch;
    this.isAsyncActive;
    this.isLaunched;
    this.btn_reset;
    this.btn_vider;
    this.lbl_hotkeys;
    this.phaser = new Phaser.Game(config.grid.width+200, config.grid.height, Phaser.CANVAS, element, this);
};

mainCanvas.prototype = {

    preload : function(){
        this.GOL = new GOL(this.config,this);
        this.phaser.load.image('cell','assets/cell_old.png');
        this.phaser.load.spritesheet('iteratif_parallel', 'assets/buttons/iteratif_parallel.png', 193, 71);
        this.phaser.load.spritesheet('launch', 'assets/buttons/lancer.png', 193, 71);
        this.phaser.load.spritesheet('vider', 'assets/buttons/vider.png', 100, 35);
        this.phaser.load.spritesheet('reset', 'assets/buttons/reset.png', 100, 35);
    },

    create : function(){
        this.GOL.create();
        this.btn_switchMode = this.phaser.add.button(800, 10, 'iteratif_parallel', this.actionOnSwitchMode, this, 0,1,2);
        this.btn_launch = this.phaser.add.button(800, 400, 'launch', this.actionOnLaunch, this, 1,0,2);
        this.isAsyncActive = false;
        this.isLaunched = false;

        this.btn_vider = this.phaser.add.button(800, 360, 'vider', this.actionOnVider, this, 1,0,0);
        this.btn_reset = this.phaser.add.button(905, 360, 'reset', this.actionOnReset, this, 1,0,0);

        var style = {font : "12 Arial", fill: "White", align: "left"};
        this.lbl_hotkeys = this.phaser.add.text(850,540,
            "Raccourcis :\n(F) : Plein ecran \n(S) : Changer de mode \n(R) : Reset \n(Entree) : Vider \n(Espace) : Lancer", style);
        this.lbl_hotkeys.anchor.set(0.5);

        this.phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
            .onDown.add(this.actionOnLaunch, this);
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.S)
            .onDown.add(this.actionOnSwitchMode, this);
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.R)
            .onDown.add(this.actionOnReset, this);
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.ENTER)
            .onDown.add(this.actionOnVider, this);
    },

    update : function () {
       this.GOL.update();
    },

    render: function (){
        this.GOL.render();
    },

    destroy : function(){
        this.destroy();
    },

    actionOnVider : function() {
        this.GOL.clearSimulation();
    },

    actionOnReset : function() {
        if (this.isLaunched) {
            this.GOL.resetSimulation();
            this.btn_launch.setFrames(1,0,2);
            this.isLaunched = false;
        }
        else {
            this.GOL.resetSimulation();
        }
    },

    actionOnLaunch : function() {
        if (this.isLaunched) {
            this.btn_launch.setFrames(1,0,2);
            this.GOL.toggleRunning();
            this.isLaunched = false;
        }
        else {
            this.btn_launch.setFrames(3,2,0);
            this.GOL.toggleRunning();
            this.isLaunched = true;
        }
    },

    actionOnSwitchMode : function() {
        if (this.isAsyncActive) {
            this.btn_switchMode.setFrames(0,1,2);
            this.GOL.switchMode();
            this.isAsyncActive = false;
        }
        else {
            this.btn_switchMode.setFrames(3, 2, 1);
            this.isAsyncActive = true;
            this.GOL.switchMode();
        }
    }
}