$.extend(Template.home, {
    coverHeading: "Le Jeu de la Vie",
    bodyText_intro: "La programmation d'un automate cellulaire est un projet SI4 2014 encadré par <a href='mailto:riveill@unice.fr'>Michel Riveill</a> pour le cours de programmation concurrente.",
    bodyText_description: "Une présentation de l'univers du Jeu de la Vie écrite par Jean-Paul Delahaye est disponible <a href='https//www2.lifl.fr/~delahaye/dnalor/Jeudelavie.pdf'>ICI</a>.",
    solution_iterative: "Solution itérative",
    solution_parallele: "Solution parallèle",
    fsp: "FSP"
});

Template.home.rendered = function(){
    
    $.getScript("/jquery.magnific.popup.js", function(data, textStatus, jqxhr) {
        $('.lead').magnificPopup({
            items: [
              {
                src: '.open-popup-link', // Dynamically created element
                type: 'inline'
              }
            ],
            gallery: {
              enabled: false
            },
            type: 'image' // this is default type
        });
    });
    
};

