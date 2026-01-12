(function ($) {
	'use strict';

	var angle = 55,
		dx = 10,
		dy = 0,
		margin = 10;

	let x1, x2, y1, y2;

	var a, b;

	var initMedals = function (svgSelector) {
		var medal;
		var pathElement;
		var centerText;
		var check;
		var sizeCM;

		$(svgSelector).each(function () {
			medal = $(this);
			pathElement = medal.find('path');
			centerText = medal.find('.center-text');
			check = medal.find('.check');

			sizeCM = medal.find('.size-cm');

			if (pathElement.length != 0) {
				// Récupère les dimensions du path
				const bbox = pathElement[0].getBBox();
				const { x, y, width, height } = bbox;

				var adjustedX = x - margin;
				var adjustedY = y - margin;

				var adjustedWidth = width + margin * 2;
				var adjustedHeight = height + margin * 2;

				var centerX, centerY;

				if (medal.hasClass('medal-size')) {
					adjustedHeight += margin;

					const leftArrow = medal.find('#left-arrow');
					const rightArrow = medal.find('#right-arrow');

					var x1 = bbox.x;
					var y1 = bbox.y + bbox.height + margin + 5;
					var x2 = bbox.x + bbox.width / 2 - margin * 2;
					var y2 = y1;

					leftArrow.attr('x1', x1);
					leftArrow.attr('y1', y1);
					leftArrow.attr('x2', x2);
					leftArrow.attr('y2', y2);

					x1 = bbox.x + bbox.width / 2 + margin * 2;
					y1 = bbox.y + bbox.height + margin + 5;
					x2 = bbox.x + bbox.width;
					y2 = y1;

					rightArrow.attr('x1', x1);
					rightArrow.attr('y1', y1);
					rightArrow.attr('x2', x2);
					rightArrow.attr('y2', y2);

					centerX = bbox.x + bbox.width / 2;
					centerY = bbox.y + bbox.height + margin + 5;

					sizeCM.attr('x', centerX);
					sizeCM.attr('y', centerY);
				}

				// Ajuste la viewBox du SVG en fonction du path avec la marge
				medal.attr(
					'viewBox',
					`${adjustedX} ${adjustedY} ${adjustedWidth} ${adjustedHeight}`
				);

				centerX = bbox.x + bbox.width / 2;
				centerY = bbox.y + bbox.height / 2;

				centerText.each(function () {
					$(this).attr('x', centerX);
					$(this).attr('y', centerY);

					if (medal.hasClass('medal-reverse')) {
						$(this).attr('x', -centerX);
					}
				});

	

				if (check.length != 0) {
					const gBBox = check[0].getBBox();

					const pathCenterX = bbox.x + bbox.width / 2;
					const pathCenterY = bbox.y + bbox.height / 2;

					const translateX = pathCenterX - gBBox.width / 2;
					const translateY = pathCenterY - gBBox.height / 2;

					check.attr('transform', `translate(${translateX}, ${translateY})`);
				}
			}
		});
	};

	function refreshMedals() {
		$('.medals > g').each(function (index) {
			$(this).css('transform', 'scale(1.0001)');
			setTimeout(() => {
				$(this).css('transform', '');
			}, 0);
		});
	}

	function initMedalColor() {
		const color = $('#single-colorPicker').val();
		$('#single-color-pattern > rect:first-child').css('fill', color);

		refreshMedals();
	}

	function initMedalCustoColor() {
		const color = $('#custo-colorPicker').val();
		$('#imagePattern > g:first-child').css('fill', color);
		$('.front-text').css('fill', color);
		$('.back-text').css('fill', color);

		refreshMedals();
	}


	function switchPopupCusto(event) {

		var offset = $('#colorPickCusto').width() * 0.25;

		$('#colorPickCusto').css(
			'left',
			event.clientX + window.scrollX - offset - 5 + 'px'
		);
		$('#colorPickCusto').css('top', event.clientY + window.scrollY + 5 + 'px');
		$('#colorPickCusto').addClass('active');

		event.stopPropagation();
	}

	function updateCustoColor() {
		var color = $(this).attr('value');
		$('#custo-colorPicker').val(color);
		initMedalCustoColor();
	}
	// document ready
	$(document).ready(function () {
		initMedals('.medals');
		initMedalColor();
		initMedalCustoColor();


		$('body').click(function () {
			$('#colorPickCusto').removeClass('active');
		});

		
		$('.medal-custo > g').click(switchPopupCusto);

		
		$('#colorPickCusto > .colorPickButton').click(updateCustoColor);

		$('#front-image-form').css('display', 'none');
		$('#back-image-form').css('display', 'none');

		$('#front-toggle').click();


		$('#front-fontSelect').on('change', function () {
			const selectedFont = $(this).val();
			$('.front-text').css('font-family', selectedFont);
		});
		$('#back-fontSelect').on('change', function () {
			const selectedFont = $(this).val();
			$('.back-text').css('font-family', selectedFont);
		});

		$('#front-textInput').on('input', function () {
			const text = $(this).val();
			$('.front-text').text(text);
		});
		$('#back-textInput').on('input', function () {
			const text = $(this).val();
			$('.back-text').text(text);
		});

		$('#front-fontSelect').trigger('change');
		$('#back-fontSelect').trigger('change');
	});
})(jQuery);
