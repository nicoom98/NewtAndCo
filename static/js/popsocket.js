(function ($) {
	'use strict';

	const margin = 10;

	var initMedals = function (svgSelector) {
		var medal;
		var pathElement;
		var centerText;

		$(svgSelector).each(function () {
			medal = $(this);
			pathElement = medal.find('path');
			centerText = medal.find('.center-text');

			if (pathElement.length != 0) {
				// Récupère les dimensions du path
				const bbox = pathElement[0].getBBox();
				const { x, y, width, height } = bbox;

				var adjustedX = x - margin;
				var adjustedY = y - margin;

				var adjustedWidth = width + margin * 2;
				var adjustedHeight = height + margin * 2;

				var centerX, centerY;

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
				});
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

	function switchPopupColor(event) {
		$('#colorPickCusto').removeClass('active');

		var offset = $('#colorPick').width() * 0.25;

		$('#colorPick').css(
			'left',
			event.clientX + window.scrollX - offset - 5 + 'px'
		);
		$('#colorPick').css('top', event.clientY + window.scrollY + 5 + 'px');
		$('#colorPick').addClass('active');
		$('#colorPick').attr('medal', $(this).attr('id'));

		event.stopPropagation();
	}
	function switchPopupCusto(event) {
		$('#colorPick').removeClass('active');

		var offset = $('#colorPick').width() * 0.25;

		$('#colorPickCusto').css(
			'left',
			event.clientX + window.scrollX - offset - 5 + 'px'
		);
		$('#colorPickCusto').css('top', event.clientY + window.scrollY + 5 + 'px');
		$('#colorPickCusto').addClass('active');

		event.stopPropagation();
	}
	function updateMedalColor() {
		var data = $(this).attr('value');

		$('#single-colorPicker').val(data);
		initMedalColor();
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
			$('#colorPick').removeClass('active');
			$('#colorPickCusto').removeClass('active');
		});

		$('.medal-color > g:not(#motif-color)').click(switchPopupColor);
		$('.medal-custo > g').click(switchPopupCusto);

		$('#colorPick > .colorPickButton').click(updateMedalColor);
		$('#colorPickCusto > .colorPickButton').click(updateCustoColor);

		$('#front-image-form').css('display', 'none');
		$('#back-image-form').css('display', 'none');

		$('#front-toggle').click();

		$('#front-fontSelect').on('change', function () {
			const selectedFont = $(this).val();
			$('.front-text').css('font-family', selectedFont);
		});

		$('#front-textInput').on('input', function () {
			const text = $(this).val();
			$('.front-text').text(text);
		});

		$('#front-fontSelect').trigger('change');
	});
})(jQuery);
