GOL = function(config,phaser){

    this.elapsedTime = 0;

    this.config = config;

    this.mouseDown = false;

    this.refreshGrid();

    this.allCells = [];
    this.cellStatuses = [];
    this.neighbors = [];

    this.cellFutures = [];

    this.asyncGeneration = false;

    this.mode = "";
    this.phaser = phaser;
};

GOL.prototype = {

    preload : function(){

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

        this.refreshGrid();

        for (var y = 0; y < this.config.numRows; y++)
        {
            for (var x = 0; x < this.config.numCols; x++)
            {
                var cell =  this.phaser.add.sprite(x * this.config.grid.cellSize, y * this.config.grid.cellSize, "cell");
                cell.visible = (Math.random() > 1-this.config.density);
                cell.width = this.config.grid.cellSize;
                cell.height = this.config.grid.cellSize;
                cell.relativeX = x;
                cell.relativeY = y;

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
        this.phaser.input.keyboard.addKey(Phaser.Keyboard.S)
            .onDown.add(this.switchMode, this);

        this.phaser.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // ALGO SIMPLISTE
        this.mode = "sync";
        ticker.subscribe(this.runGeneration);
    },

    update : function () {
        if(  !this.phaser.input.activePointer.isDown)
            return;

        if(this.phaser.input.x<this.config.grid.width){
            var x = Math.floor(this.phaser.input.x/this.config.grid.cellSize);
            var y = Math.floor(this.phaser.input.y/this.config.grid.cellSize);
            var cell = this.allCells[y * this.config.numCols + x];


        if( this.phaser.input.mouse.button == Phaser.Mouse.MIDDLE_BUTTON)
            cell.visible = false;
        else
            cell.visible = true;

        this.cellStatuses[y * this.config.numCols + x] = cell.visible;
        }
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
        this.phaser.phaser.debug.text("fps : " + Math.floor(1000/this.phaser.time.elapsed), 32, 32);
    },

    destroy : function(){
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
                cell.relativeX = x;
                cell.relativeY = y;

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

    switchMode : function() {

        if (ticker.isActive()) {
            var self = this;
            ticker.stop();
            window.setTimeout(function(){
                self.switchMode();
                console.log("switchMode");
            }, 100);
            return;
        }
        if (this.mode == "async") {
            console.log("caca");
            ticker.unsubscribe(this.launchAsyncGeneration);
            ticker.subscribe(this.runGeneration);
            this.mode = "sync";
        }
        else {
            ticker.unsubscribe(this.runGeneration);
            ticker.subscribe(this.launchAsyncGeneration);
            this.mode = "async";
        }
        this.toggleRunning();
    },

    evaluateOneStep : function(cell) {

        var cellAlive = false;
        var numAliveNeighbors = 0;
        var self = this;

        cellAlive = self.cellStatuses[cell.relativeY * self.config.numCols + cell.relativeX];
        numAliveNeighbors = self.getNumAliveNeighbors(self.cellStatuses, cell.relativeX, cell.relativeY);

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

        self.cellFutures[cell.relativeY * self.config.numCols + cell.relativeX] = cell.visible;

    },

    endOfAsyncGeneration : function() {

        var tmp = this.cellStatuses;
        this.cellStatuses = this.cellFutures;
        this.cellFutures = tmp;

        this.asyncGeneration = false;

        //this.launchAsyncGeneration();

    },

    launchAsyncGeneration : function() {

        if (this.asyncGeneration) {
            return;
        }
        this.asyncGeneration = true;
        // Array to hold async tasks
        var asyncTasks = [];

        var self = this;
        self.allCells.forEach(function(cell) {
            asyncTasks.push(function(callback) {
                self.evaluateOneStep(cell);
                callback();
            });
        });

        async.parallel(asyncTasks, function(err, results){

            // All tasks are done now
            //console.log("Yolo !");
            self.endOfAsyncGeneration();
        });
    },

    runGeneration : function(){

        // make a copy of the cell statuses that we can read from
        var cellAlive = false;
        var numAliveNeighbors = 0;
        var cell;

        for (var y = 0; y < this.config.numRows; y++)
        {
            for (var x = 0; x < this.config.numCols; x++)
            {
                cell = this.allCells[y * this.config.numCols + x];
                cellAlive = this.cellStatuses[y * this.config.numCols + x];
                numAliveNeighbors = this.getNumAliveNeighbors(this.cellStatuses, x, y);

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

                this.cellFutures[y * this.config.numCols + x] = cell.visible;
            }
        }
        var tmp = this.cellStatuses;
        this.cellStatuses = this.cellFutures;
        this.cellFutures = tmp;

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