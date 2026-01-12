// The debounce function receives our function as a parameter
const debounce = (fn) => {
	// This holds the requestAnimationFrame reference, so we can cancel it if we wish
	let frame;

	// The debounce function returns a new function that can receive a variable number of arguments
	return (...params) => {
		// If the frame variable has been defined, clear it now, and queue for next frame
		if (frame) {
			cancelAnimationFrame(frame);
		}

		// Queue our function call for the next frame
		frame = requestAnimationFrame(() => {
			// Call our function and pass any params we received
			fn(...params);
		});
	};
};

// Reads out the scroll position and stores it in the data attribute
// so we can use it in our stylesheets
const storeScroll = () => {
	document.documentElement.dataset.scroll = window.scrollY;
};

// Listen for new scroll events, here we debounce our `storeScroll` function
document.addEventListener('scroll', debounce(storeScroll), { passive: true });

// Update scroll position for first time
storeScroll();

(function ($) {
	'use strict';

	var initPreloader = function () {
		$(document).ready(function ($) {
			var Body = $('body');
			Body.addClass('preloader-site');
		});
	};

	// init Chocolat light box
	var initChocolat = function () {
		Chocolat(document.querySelectorAll('.image-link'), {
			imageSize: 'contain',
			loop: true,
		});
	};

	var initSwiper = function () {
		var swiper = new Swiper('.main-swiper', {
			speed: 1000,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		});

		var bestselling_swiper = new Swiper('.product-large-slider', {
			speed: 1000,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		});

		var bestselling_swiper = new Swiper('.medal-slider', {
			slidesPerView: 'auto',
			spaceBetween: 30,
			speed: 500,
			autoplay: {
				delay: 2000,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		});

		var products_swiper = new Swiper('.testimonial-carousel', {
			slidesPerView: 1,
			spaceBetween: 30,
			speed: 500,
			autoplay: {
				delay: 2000,
				disableOnInteraction: false,
			},
		});
	};

	var initProductQty = function () {
		$('.product-qty').each(function () {
			var $el_product = $(this);
			var quantity = 0;

			$el_product.find('.quantity-right-plus').click(function (e) {
				e.preventDefault();
				var quantity = parseInt($el_product.find('#quantity').val());
				var maxQTE = parseInt($el_product.find('#quantity').attr('maxvalue'));
				if (quantity < maxQTE) {
					$el_product.find('#quantity').val(quantity + 1);
				} else {
					$('#alert-qte').removeClass('d-none');
				}
			});

			$el_product.find('.quantity-left-minus').click(function (e) {
				e.preventDefault();
				var quantity = parseInt($el_product.find('#quantity').val());
				if (quantity > 0) {
					$el_product.find('#quantity').val(quantity - 1);
					$('#alert-qte').addClass('d-none');
				}
			});
		});
	};

	// init jarallax parallax
	var initJarallax = function () {
		jarallax(document.querySelectorAll('.jarallax'));

		jarallax(document.querySelectorAll('.jarallax-keep-img'), {
			keepImg: true,
		});
	};

	function createMosaic(images, targetDiv) {
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var rows = Math.ceil(Math.sqrt(images.length));
		var cols = rows;

		var imgWidth = 500; // Largeur fixe pour chaque image
		var imgHeight = 500; // Hauteur fixe pour chaque image

		function loadImage(src) {
			return new Promise((resolve, reject) => {
				var img = new Image();
				img.crossOrigin = 'Anonymous'; // Set crossOrigin attribute
				img.onload = () => {
					// Vérifiez les dimensions de l'image
					if (img.width === 0 || img.height === 0) {
						reject(new Error('Image dimensions are zero'));
					} else {
						resolve(img);
					}
				};
				img.onerror = (error) => {
					alert(`Failed to load image: ${src}`);
					alert(error);
					reject(error);
				};
				img.src = src;
			});
		}

		Promise.all(images.map(loadImage))
			.then((loadedImages) => {
				canvas.width = cols * imgWidth;
				canvas.height = rows * imgHeight;
				loadedImages.forEach((img, index) => {
					var x = (index % cols) * imgWidth;
					var y = Math.floor(index / cols) * imgHeight;

					// Calculate the new dimensions while maintaining the aspect ratio
					var aspectRatio = img.width / img.height;
					var newWidth, newHeight;
					if (aspectRatio > 1) {
						newWidth = imgWidth;
						newHeight = imgWidth / aspectRatio;
					} else {
						newHeight = imgHeight;
						newWidth = imgHeight * aspectRatio;
					}

					// Center the image within the fixed size
					var offsetX = (imgWidth - newWidth) / 2;
					var offsetY = (imgHeight - newHeight) / 2;

					ctx.drawImage(img, x + offsetX, y + offsetY, newWidth, newHeight);
				});
				var dataURL = canvas.toDataURL();
				$(targetDiv).css('background-image', 'url(' + dataURL + ')');
			})
			.catch((error) => {
				alert('Failed to create mosaic');
				alert(error);
			});
	}

	// document ready
	$(document).ready(function () {
		initPreloader();
		initSwiper();
		initProductQty();
		initJarallax();
		initChocolat();

		$('.img-item').on('mouseover mouseleave', function () {
			var src = $(this).attr('src');
			$(this).attr('src', $(this).attr('src2'));
			$(this).attr('src2', src);
		});

		$('.drop-zone').change(function (e) {
			var files = e.target.files;
			var imageSources = [];

			for (var i = 0; i < files.length; i++) {
				imageSources[i] = URL.createObjectURL(files[i]);
			}

			createMosaic(imageSources, $(this));
		});

		//isotope
		$('.isotope-container').isotope({
			// options
			itemSelector: '.item',
			layoutMode: 'masonry',
		});

		var $grid = $('.entry-container').isotope({
			itemSelector: '.entry-item',
			layoutMode: 'masonry',
		});

		// Initialize Isotope
		var $container = $('.isotope-container').isotope({
			// options
			itemSelector: '.item',
			layoutMode: 'masonry',
		});

		//active button
		$('.filter-button').click(function () {
			$('.filter-button').removeClass('active');
			$(this).addClass('active');
		});

		// Filter items on button click
		$('.filter-button').click(function () {
			var filterValue = $(this).attr('data-filter');
			if (filterValue === '*') {
				// Show all items
				$container.isotope({ filter: '*' });
			} else {
				// Show filtered items
				$container.isotope({ filter: filterValue });
			}
		});
	}); // End of a document
})(jQuery);

$(window).on('load', function () {
	$('.preloader-wrapper').fadeOut();
	$('body').removeClass('preloader-site');
});
