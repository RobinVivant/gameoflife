$.extend(Template.home, {
    coverHeading: "Le Jeu de la Vie",
    bodyText_intro: "La programmation d'un automate cellulaire est un projet SI4 2014 encadré par <a href='mailto:riveill@unice.fr'>Michel Riveill</a> pour le cours de programmation concurrente.",
    bodyText_description: "Une présentation de l'univers du Jeu de la Vie écrite par Jean-Paul Delahaye est disponible <a href='https://www2.lifl.fr/~delahaye/dnalor/Jeudelavie.pdf'>ICI</a>."
    //btn_solIt: "<a class='btn btn-lg btn-default' href='#test-popup' data-effect='mfp-zoom-out' >Solution itérative</a>",
    //solution_parallele: "Solution parallèle",
    //fsp: "FSP"
});

Template.home.rendered = function(){
    /*    Meteor.defer(function(){

        $('#test-popup').magnificPopup({
            type: 'image'
            });
    });
*/
};

