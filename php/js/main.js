$(function() {
	//validation
	ezValidation.init();

	// scroll to div
	$('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top - 72
	        }, 1000);
	        return false;
	      }
	    }
	});


	// parrlax effect
	$('.bgParallax').each(function(){
		var $obj = $(this);

		$(window).scroll(function() {
			var yPos = -($(window).scrollTop() / $obj.data('speed'));

			var bgpos = '50% '+ yPos + 'px';

			$obj.css('background-position', bgpos ) ;

		});
	});


	// loader
	$(window).load(function() {
	  $('.loader').fadeOut(500);
	});

	//star rating
	$(".rating").starRating({
		//minus: true // step minus button
	});
	$(".ratingbigger").starRating({
		//minus: true // step minus button
	});

	$(document).ready(function(){
	    $('textarea').autosize();   
	});

	$(".add-review-btn").click(function(){
		var content = document.getElementById('reviewText').value;
		console.log(content);
		$('.two.right').append('<p>'+content+'</p>');
	});


/*!
	Autosize 1.18.13
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function ($) {
	var
	defaults = {
		className: 'autosizejs',
		id: 'autosizejs',
		append: '\n',
		callback: false,
		resizeDelay: 10,
		placeholder: true
	},

	// border:0 is unnecessary, but avoids a bug in Firefox on OSX
	copy = '<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',

	// line-height is conditionally included because IE7/IE8/old Opera do not return the correct value.
	typographyStyles = [
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'letterSpacing',
		'textTransform',
		'wordSpacing',
		'textIndent',
		'whiteSpace'
	],

	// to keep track which textarea is being mirrored when adjust() is called.
	mirrored,

	// the mirror element, which is used to calculate what size the mirrored element should be.
	mirror = $(copy).data('autosize', true)[0];

	// test that line-height can be accurately copied.
	mirror.style.lineHeight = '99px';
	if ($(mirror).css('lineHeight') === '99px') {
		typographyStyles.push('lineHeight');
	}
	mirror.style.lineHeight = '';

	$.fn.autosize = function (options) {
		if (!this.length) {
			return this;
		}

		options = $.extend({}, defaults, options || {});

		if (mirror.parentNode !== document.body) {
			$(document.body).append(mirror);
		}

		return this.each(function () {
			var
			ta = this,
			$ta = $(ta),
			maxHeight,
			minHeight,
			boxOffset = 0,
			callback = $.isFunction(options.callback),
			originalStyles = {
				height: ta.style.height,
				overflow: ta.style.overflow,
				overflowY: ta.style.overflowY,
				wordWrap: ta.style.wordWrap,
				resize: ta.style.resize
			},
			timeout,
			width = $ta.width(),
			taResize = $ta.css('resize');

			if ($ta.data('autosize')) {
				// exit if autosize has already been applied, or if the textarea is the mirror element.
				return;
			}
			$ta.data('autosize', true);

			if ($ta.css('box-sizing') === 'border-box' || $ta.css('-moz-box-sizing') === 'border-box' || $ta.css('-webkit-box-sizing') === 'border-box'){
				boxOffset = $ta.outerHeight() - $ta.height();
			}

			// IE8 and lower return 'auto', which parses to NaN, if no min-height is set.
			minHeight = Math.max(parseInt($ta.css('minHeight'), 10) - boxOffset || 0, $ta.height());

			$ta.css({
				overflow: 'hidden',
				overflowY: 'hidden',
				wordWrap: 'break-word' // horizontal overflow is hidden, so break-word is necessary for handling words longer than the textarea width
			});

			if (taResize === 'vertical') {
				$ta.css('resize','none');
			} else if (taResize === 'both') {
				$ta.css('resize', 'horizontal');
			}

			// The mirror width must exactly match the textarea width, so using getBoundingClientRect because it doesn't round the sub-pixel value.
			// window.getComputedStyle, getBoundingClientRect returning a width are unsupported, but also unneeded in IE8 and lower.
			function setWidth() {
				var width;
				var style = window.getComputedStyle ? window.getComputedStyle(ta, null) : false;
				
				if (style) {

					width = ta.getBoundingClientRect().width;

					if (width === 0 || typeof width !== 'number') {
						width = parseInt(style.width,10);
					}

					$.each(['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'], function(i,val){
						width -= parseInt(style[val],10);
					});
				} else {
					width = $ta.width();
				}

				mirror.style.width = Math.max(width,0) + 'px';
			}

			function initMirror() {
				var styles = {};

				mirrored = ta;
				mirror.className = options.className;
				mirror.id = options.id;
				maxHeight = parseInt($ta.css('maxHeight'), 10);

				// mirror is a duplicate textarea located off-screen that
				// is automatically updated to contain the same text as the
				// original textarea.  mirror always has a height of 0.
				// This gives a cross-browser supported way getting the actual
				// height of the text, through the scrollTop property.
				$.each(typographyStyles, function(i,val){
					styles[val] = $ta.css(val);
				});
				
				$(mirror).css(styles).attr('wrap', $ta.attr('wrap'));

				setWidth();

				// Chrome-specific fix:
				// When the textarea y-overflow is hidden, Chrome doesn't reflow the text to account for the space
				// made available by removing the scrollbar. This workaround triggers the reflow for Chrome.
				if (window.chrome) {
					var width = ta.style.width;
					ta.style.width = '0px';
					var ignore = ta.offsetWidth;
					ta.style.width = width;
				}
			}

			// Using mainly bare JS in this function because it is going
			// to fire very often while typing, and needs to very efficient.
			function adjust() {
				var height, original;

				if (mirrored !== ta) {
					initMirror();
				} else {
					setWidth();
				}

				if (!ta.value && options.placeholder) {
					// If the textarea is empty, copy the placeholder text into 
					// the mirror control and use that for sizing so that we 
					// don't end up with placeholder getting trimmed.
					mirror.value = ($ta.attr("placeholder") || '');
				} else {
					mirror.value = ta.value;
				}

				mirror.value += options.append || '';
				mirror.style.overflowY = ta.style.overflowY;
				original = parseInt(ta.style.height,10);

				// Setting scrollTop to zero is needed in IE8 and lower for the next step to be accurately applied
				mirror.scrollTop = 0;

				mirror.scrollTop = 9e4;

				// Using scrollTop rather than scrollHeight because scrollHeight is non-standard and includes padding.
				height = mirror.scrollTop;

				if (maxHeight && height > maxHeight) {
					ta.style.overflowY = 'scroll';
					height = maxHeight;
				} else {
					ta.style.overflowY = 'hidden';
					if (height < minHeight) {
						height = minHeight;
					}
				}

				height += boxOffset;

				if (original !== height) {
					ta.style.height = height + 'px';
					if (callback) {
						options.callback.call(ta,ta);
					}
					$ta.trigger('autosize.resized');
				}
			}

			function resize () {
				clearTimeout(timeout);
				timeout = setTimeout(function(){
					var newWidth = $ta.width();

					if (newWidth !== width) {
						width = newWidth;
						adjust();
					}
				}, parseInt(options.resizeDelay,10));
			}

			if ('onpropertychange' in ta) {
				if ('oninput' in ta) {
					// Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
					// so binding to onkeyup to catch most of those occasions.  There is no way that I
					// know of to detect something like 'cut' in IE9.
					$ta.on('input.autosize keyup.autosize', adjust);
				} else {
					// IE7 / IE8
					$ta.on('propertychange.autosize', function(){
						if(event.propertyName === 'value'){
							adjust();
						}
					});
				}
			} else {
				// Modern Browsers
				$ta.on('input.autosize', adjust);
			}

			// Set options.resizeDelay to false if using fixed-width textarea elements.
			// Uses a timeout and width check to reduce the amount of times adjust needs to be called after window resize.

			if (options.resizeDelay !== false) {
				$(window).on('resize.autosize', resize);
			}

			// Event for manual triggering if needed.
			// Should only be needed when the value of the textarea is changed through JavaScript rather than user input.
			$ta.on('autosize.resize', adjust);

			// Event for manual triggering that also forces the styles to update as well.
			// Should only be needed if one of typography styles of the textarea change, and the textarea is already the target of the adjust method.
			$ta.on('autosize.resizeIncludeStyle', function() {
				mirrored = null;
				adjust();
			});

			$ta.on('autosize.destroy', function(){
				mirrored = null;
				clearTimeout(timeout);
				$(window).off('resize', resize);
				$ta
					.off('autosize')
					.off('.autosize')
					.css(originalStyles)
					.removeData('autosize');
			});

			// Call adjust in case the textarea already contains text.
			adjust();
		});
	};
}(jQuery || $)); // jQuery or jQuery-like library, such as Zepto
/*
	//populating courses
	var contentSize = 30;
    $.getResults(function(){
    	console.log('som');
		var	endDiv = '</div>',
			title = '<div class="title">',
			description = '<div class="description">',
			type = '<span class="type">',
			reviews = '<span class="reviews">',
			campus = '<span class="campus">',
			endSpan = '</span>',
			rating = '<div class="right"><div class="rating" data-rating-max="'
			endRating = '"></div>';


	    for(var i = 0; i < response.results.length; i++) {
	    	var loop = i+1;
	    	if(loop>4){
	    		loop = loop%4+1;
	    	}

		var entryStart = '<div class="entry"><img src="img/room' + loop + '.jpg" alt=""><div class="bottom"><div class="left">';
		var snippet = '<a href="details.php">' + entryStart + title + "Course Title" + " " + "Course Id: xxx" + '</p>' + endDiv + description + type + " W " + ' |' + endSpan + reviews + " 5 " + " Reviews | "+ endSpan + endSpan + endDiv + endDiv + rating + " 5 " + endRating + endDiv + endDiv + endDiv + '</a> ';
		console.log(snippet);
		$('.realContent').append(snippet);
		}
    });
*/
/*
	//getting JSON SEARCH
	var url = "json/db.json";
	var search;
	if(typeof searchResultData != 'undefined'){
		search = searchResultData;
		console.log(search);
	}
	$.getJSON(url, function(response){

		var	endDiv = '</div>',
			title = '<div class="title">',
			description = '<div class="description">',
			type = '<span class="type">',
			reviews = '<span class="reviews">',
			campus = '<span class="campus">',
			endSpan = '</span>',
			rating = '<div class="right"><div class="rating" data-rating-max="'
			endRating = '"></div>';


	    for(var i = 0; i < response.results.length; i++) {
	    	var loop = i+1;
	    	if(loop>4){
	    		loop = loop%4+1;
	    	}
			var entryStart = '<div class="entry"><img src="img/room' + loop + '.jpg" alt=""><div class="bottom"><div class="left">';
	    	var room = 	response.results[i].room,
	    		$hall =  room.hall + '\n',
	    		$roomNum = "Room # " + room.room + '\n',
	    		$type = room.type,
	    		$rating = "rating : " + room.rating + '\n',
	    		$raters = "raters : " + room.raters + '\n',
	    		$ac = "ac : " +room.ac + '\n',
	    		$laundry = "laundry : " + room.laundry + '\n',
	    		$campus = "campus : " + room.campus + '\n';

	    		if($type == "D") $type = "Double" + '\n';
	    		if($type == "S") $type = "Single" + '\n';

	    		if(search.room == room.room){
	    			$('#resultText').text('Found your Room');
	    			$('.realContent').append('<a href="details.php">' + entryStart + title + $hall + " " + $roomNum + '</p>' + endDiv + description + type + $type + ' |' + endSpan + reviews + $rating + " Reviews |"+ endSpan + campus + $campus + endSpan + endDiv + endDiv + rating + $rating + endRating + endDiv + endDiv + endDiv + '</a> ');
	    			break;
	    		}else if(search.room != ""){
	    			$('#resultText').text('Didn\'t find your Room');
	    		}
				if(search.ac == "on" && room.ac == 1){
					$('#resultText').text('Found rooms with AC');
					$('.realContent').append('<a href="details.php">' + entryStart + title + $hall + " " + $roomNum + '</p>' + endDiv + description + type + $type + ' |' + endSpan + reviews + $rating + " Reviews |"+ endSpan + campus + $campus + endSpan + endDiv + endDiv + rating + $rating + endRating + endDiv + endDiv + endDiv + '</a> ');
				}else{
					$('.realContent').append('<a href="details.php">' + entryStart + title + $hall + " " + $roomNum + '</p>' + endDiv + description + type + $type + ' |' + endSpan + reviews + $rating + " Reviews |"+ endSpan + campus + $campus + endSpan + endDiv + endDiv + rating + $rating + endRating + endDiv + endDiv + endDiv + '</a> ');
				}

				

	    }
	});*/
});
