

Template.simulation.created = function(){
    $("#golImage").hide();
    gol = new GOL('gol-canvas', GOLGConfig);

    $('#gol-canvas').on("contextmenu", function(evt) {return false;});

    $('#changeRes').click(function() {

        alert($('#resolution').text);


    });
};

Template.simulation.destroyed = function(){
    $("#golImage").show();
    gol.destroy();
    gol = null;
};
