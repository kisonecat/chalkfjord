$(function() {
    var socket = io.connect();

    var deck = bespoke.from('#presentation', [
	bespoke.themes.cube(),
	bespoke.plugins.keys(),
	bespoke.plugins.touch(),
	bespoke.plugins.backdrop(),
	bespoke.plugins.classes(),
	bespoke.plugins.progress(),
	bespoke.plugins.hash(),	
	bespoke.plugins.scale()
    ]);

    window.deck = deck;

    deck.on("activate", function(event) {
	// Stop all YouTube players
	$('.youtube-player').each( function() {
	    this.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
	});

	// Only let the presenter request a slide change
	if (!(event.remote))
	    if (presenter)
		socket.emit('slide', event.index );
	
	return;
    });

    $("textarea").on('change keyup paste', function() {
	var content = $(this).val();
	var key = $(this).attr('id');
	socket.emit('text', { key: key, content: content } );
    });    

    // Don't change the slide when you're editing a textarea
    deck.on("next", function(event) {
	if ($(":focus").prop("tagName") == "TEXTAREA") {
	    return false;
	}
    });

    deck.on("prev", function(event) {
	if ($(":focus").prop("tagName") == "TEXTAREA") {
	    return false;
	}
    });    

    // Change to slide when the presenter requests it
    socket.on('slide', function(data) {
	deck.slide( data, { remote: true } );
    });

    socket.on('text', function(data) {
	console.log( data );
	$("#" + data.key + "-results").text( data.content );
    });

    if (initialSlide)
	deck.slide( initialSlide );
});

