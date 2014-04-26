GOL = function(element, config){
    
    this.elapsedTime = 0;
    
    this.config = config;

    this.mouseDown = false;

    this.refreshGrid();

    this.allCells = [];
    this.cellStatuses = [];
    this.neighbors = [];


    this.phaser = new Phaser.Game(config.grid.width, config.grid.height, Phaser.CANVAS, element, this);
};

GOL.prototype = {

    preload : function(){
        this.phaser.load.image('cell','assets/cell.png');
    },

    create : function(){
        this.neighbors = [
            new Phaser.Point(-1, -1),
            new Phaser.Point(0, -1),
            new Phaser.Point(1, -1),
            new Phaser.Point(1, 0),
            new Phaser.Point(1, 1),
            new Phaser.Point(0, 1),
            new Phaser.Point(-1, 1),
            new Phaser.Point(-1, 0)
        ];

        this.allCells = [];
        this.cellStatuses = [];

        this.refreshGrid();

        this.allCells = [];
        this.cellStatuses = [];

        for (var y = 0; y < this.config.numRows; y++)
        {
            for (var x = 0; x < this.config.numCols; x++)
            {
                var cell =  this.phaser.add.sprite(x * this.config.grid.cellSize, y * this.config.grid.cellSize, "cell");
                cell.visible = (Math.random() > 1-this.config.density);
                cell.width = this.config.grid.cellSize;
                cell.height = this.config.grid.cellSize;

                this.allCells.push(cell);
                this.cellStatuses.push(cell.visible);
            }
        }

        this.phaser.input.mouse.mouseDownCallback = this.onMouseDown;
        this.phaser.input.mouse.mouseUpCallback = this.onMouseUp;
        this.phaser.input.mouse.callbackContext = this;

        this.phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
            .onDown.add(this.toggleRunning, this);
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.R)
            .onDown.add(this.resetSimulation, this);
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.ENTER)
            .onDown.add(this.clearSimulation, this);
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.F)
            .onDown.add(this.goFS, this);

        this.phaser.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;


        // ALGO SIMPLISTE
        ticker.subscribe(this.runGeneration);

    },

    update : function () {
        if(  !this.phaser.input.activePointer.isDown)
            return;



        var x = Math.floor(this.phaser.input.x/this.config.grid.cellSize);
        var y = Math.floor(this.phaser.input.y/this.config.grid.cellSize);
        var cell = this.allCells[y * this.config.numCols + x];

        if( this.phaser.input.mouse.button == Phaser.Mouse.MIDDLE_BUTTON)
            cell.visible = false;
        else
            cell.visible = true;

        this.cellStatuses[y * this.config.numCols + x] = cell.visible;

    },
    
    refreshGrid : function(){
        var minLength =
            this.config.grid.width > this.config.grid.height ?
                this.config.grid.height : this.config.grid.width;

        this.config.grid.cellSize = Math.floor(minLength * this.config.grid.resolution);

        this.config.numRows = Math.floor(this.config.grid.height/this.config.grid.cellSize);
        this.config.numCols = Math.floor(this.config.grid.width/this.config.grid.cellSize);
    },

    render: function (){
        this.phaser.debug.text("fps : " + Math.floor(1000/this.phaser.time.elapsed), 32, 32);
    },

    destroy : function(){
        this.phaser.destroy();
    },

    toggleRunning : function(){
        if( ticker.isActive() )
            ticker.stop();
        else
            ticker.start(this, Math.floor(1+1000*(1-this.config.speed)) );
    },

    clearSimulation : function(){
        ticker.stop();

        this.allCells.forEach(function(cell){
            cell.visible = false;
        });
        for( var i = 0; i < this.cellStatuses.length; i++){
            this.cellStatuses[i] = false;
        }
    },

    resetSimulation : function(){
        ticker.stop();

        this.refreshGrid();

        this.allCells.forEach(function(cell){
            cell.kill();
        });
        this.allCells = [];
        this.cellStatuses = [];

        for (var y = 0; y < this.config.numRows; y++)
        {
            for (var x = 0; x < this.config.numCols; x++)
            {
                var cell =  this.phaser.add.sprite(x * this.config.grid.cellSize, y * this.config.grid.cellSize, "cell");
                cell.visible = (Math.random() > 1-this.config.density);
                cell.width = this.config.grid.cellSize;
                cell.height = this.config.grid.cellSize;

                this.allCells.push(cell);
                this.cellStatuses.push(cell.visible);
            }
        }
    },

    onMouseDown : function(){
        this.mouseDown = true;
    },

    onMouseUp : function(){
        this.mouseDown = false;

    },

    goFS : function(){
        this.phaser.scale.startFullScreen();
        this.phaser.scale.setShowAll();
        this.phaser.scale.refresh();

    },

    runGeneration : function(){

        // make a copy of the cell statuses that we can read from
        var cellStatusesRead = this.cellStatuses.slice(0, this.config.numRows * this.config.numCols);
        var cellAlive = false;
        var numAliveNeighbors = 0;
        var cell;

        for (var y = 0; y < this.config.numRows; y++)
        {
            for (var x = 0; x < this.config.numCols; x++)
            {
                cell = this.allCells[y * this.config.numCols + x];
                cellAlive = cellStatusesRead[y * this.config.numCols + x];
                numAliveNeighbors = this.getNumAliveNeighbors(cellStatusesRead, x, y);

                if (cellAlive)
                {
                    if (numAliveNeighbors < 2 || numAliveNeighbors > 3)
                    {
                        cell.visible = false;
                    }
                    else
                    {
                        cell.visible = true;
                    }
                }
                else
                {
                    if (numAliveNeighbors == 3)
                    {
                        cell.visible = true;
                    }
                }

                this.cellStatuses[y * this.config.numCols + x] = cell.visible;
            }
        }
    },

    getNumAliveNeighbors : function(cells, x, y){
        var numAliveNeighbors = 0;

        for (var i = 0; i < this.neighbors.length; i++)
        {
            var point = this.neighbors[i];
            var xx = x + point.x;
            var yy = y + point.y;

            if (xx < 1 || xx >= this.config.numCols - 1)
            {
                continue;
            }

            if (yy < 1 || yy >= this.config.numRows - 1)
            {
                continue;
            }

            if (cells[yy * this.config.numCols + xx])
            {
                numAliveNeighbors++;
            }
        }

        return numAliveNeighbors;
    }

};