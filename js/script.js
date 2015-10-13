$( document ).ready(function() {


	var audio = document.createElement('audio');

	var pollStreamInformation = false;

	var timer;

	// Read titles from channels.js
	$.each(data.channels, function(key, value) {
		$(channels).append("<div id='" + value.id + /* "' title='"+value.description +*/ "' class='entry'>" + value.name + "</div>");
	});


	function getStreamSource(id) {	
		var src = '';
		$.each(data.channels, function(key, value) {
			if (value.id == id) { 
				src = value.src;
			}
		});
		return src;
	}


	function getStreamName(id) {
		var name = '';
		$.each(data.channels, function(key, value) {
			if (value.id == id) { 
				name = value.name;
			}
		});
		return name;
	}

	//fetch current track
	function getStreamInformation(id) {
		if (pollStreamInformation) {
			$.ajax({
			 	url: 'http://www.di.fm/_papi/v1/di/track_history',
			 	success: function(result){
	        		console.log(result[id].artist);
	        		console.log(result[id].title);

	        		$( '#metaArtist' ).html('<strong>' + result[id].artist + '</strong>');
	        		$( '#metaTitle' ).html(result[id].title );
	    		},
	    		error: function(xhr){
	            	alert("An error occured: " + xhr.status + " " + xhr.statusText);
	        	}
	    	});
			
			timer = setTimeout(function() { getStreamInformation(id) }, 1000*10);
		}
    }

    //UI Stuff
	$( channels ).click(function(event) {	
		clearTimeout(timer);	
		var lastItem = $('.entry.active');		
		if (lastItem) {
			var lastId = lastItem.attr('id');
			if (lastId) {
				lastItem.removeClass('active');
				lastItem.removeClass('nohover');
				lastItem.html(getStreamName(lastId));
			}						
		}

		var item = $(event.target);
	    var id = item.attr('id');
	    item.addClass('active');
	    item.addClass('nohover');

	    if (lastId == id && !audio.paused) {
	    	audio.pause();
	    } else {
	    	audio.src = getStreamSource(id);
			audio.play();
	    }
	});


	$( '#playPause' ).click(function(event) {	
		clearTimeout(timer);	
		if (!audio.paused) {
			audio.pause();
		} else {
			var lastItem = $('.entry.active');
			var lastId = lastItem.attr('id');				
			if (lastId) {
				audio.src = getStreamSource(lastId);
				audio.play();
			}
		}
	});

	//todo: create an actual volume slider
	$( '#volume' ).click(function(event) {		
		if (audio.volume == 1) {
			audio.volume = 0.1;

		} else audio.volume = 1;
	});

	//Things to do, when the audio plays
	audio.onplay = function() {
    	$('#playPause').html('<i class="fa fa-pause fa-lg"></i>');
		$('#playPause').css( "background-color", "#850b0b" );

		var activeItem = $('.entry.active');
		var id = activeItem.attr('id');
		activeItem.html('<i class="fa fa-play"></i>' + "&nbsp" + getStreamName(id));
		$('#headerStreamName').html(getStreamName(id));
		pollStreamInformation = true;
		getStreamInformation(id);		
	};


	//Things to do, when audio paused
	audio.onpause = function() {
		$('#playPause').html('<i class="fa fa-play fa-lg"></i>');
		$('#playPause').css( "background-color", "#850b0b" );

		var activeItem = $('.entry.active');
		var id = activeItem.attr('id');
		activeItem.html(getStreamName(id));
		pollStreamInformation = false;

		var oldSrc = audio.src;
		audio.src = '';

	};


	var oldTime = 0;
	var newTime = 0;

	//Detect if the stream buffers
	setInterval(function() {
		oldTime = newTime;		
		newTime = audio.currentTime;
		if ((oldTime == newTime) && !audio.paused) {
			console.log('buffering');
			$('#playPause').html('<i class="fa fa-hourglass fa-pulse fa-lg"></i>');
		} else if (audio.paused) {
			$('#playPause').html('<i class="fa fa-play fa-lg"></i>');
		} else if (!audio.paused) {
			$('#playPause').html('<i class="fa fa-pause fa-lg"></i>');
		}

	}, 500);

});