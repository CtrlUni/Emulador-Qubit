$(document).ready(function() {
	// Tab-related junk
	$('.tab-container').each(function() {
		var tabs = $(this).children('.tabs').children('.tab');
		var panes = $(this).children('.tab-panes').children('.tab-pane');
		var scroll_top = $(this).children('.tab-panes').offset().top - $(this).children('.tabs').outerHeight();

		tabs.each(function(index) {
			if (undefined !== panes[index]) {
				$(this).click(function(){
					tabs.removeClass('active');
					$(tabs[index]).addClass('active');
					panes.removeClass('active');
					$(panes[index]).addClass('active');

					$('body').animate({scrollTop:  scroll_top}, 400);
				});
			}
		});
	});

	$('html').on('touchend', winScroll);
	$(window).on('scroll', winScroll);


	// When you scroll the window, do some shit
	function winScroll() {

		console.log('Scroll position: ' + $(window).scrollTop());

		var topnav = $('nav').first();
		var content = $('.tab-container').first();
		var player = $('.sidebar .player');

		// Pin Top Nav as necessary
		if ($(window).scrollTop() > topnav.offset().top) {
			//$(this).css({'margin-top': topnav.outerHeight() + 'px'});
			topnav.addClass('scrolled');
		}

		if ($(window).scrollTop() <= content.offset().top) {
			//$(this).css({'margin-top' : '0px'});
			topnav.removeClass('scrolled');
		}
	}

	$(window).resize(resizeFeatured);

	$('.btn.close').click(closeSidebar);

	$('.thumb').click(function() {
		openSidebar($(this).html());
	});

	// Show the sidebar
	function openSidebar(innerHTML) {
		var $container = $('.container'), $window = $('html,body');

		$('.sidebar .player .thumb').html(innerHTML);
		$('.sidebar').removeClass('closed');

		// 230 is the CSS-defined height of the sidebar
		$container.css('margin-bottom', '230px');

		$window.animate({scrollTop: $(window).scrollTop() + 230 }, 100);
	}

	// Close the sidebar
	function closeSidebar() {
		var $container = $('.container'), $window = $('html,body');

		$('.sidebar .player').removeClass('scrolled');
		$('.sidebar').addClass('closed');

		$container.css('margin-bottom', 0);

		$window.animate({scrollTop: $(window).scrollTop() - 230 }, 100);
	}

	function resizeFeatured() {
		var width = $('.carousel').first().outerWidth();
		$('.carousel').css({'height' : ((width * 7) / 16) + 'px'});
	}

	resizeFeatured();
});