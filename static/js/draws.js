(function ($) {
	const margin = 10;

	('use strict');

	var initdraws = function (svgSelector) {
		var draw;
		var pathElement;
		var centerText;
		var check;

		$(svgSelector).each(function () {
			draw = $(this);
			pathElement = draw.find('rect');
			centerText = draw.find('.center-text');
			check = draw.find('.check');

			sizeCMH = draw.find('.size-H');
			sizeCMV = draw.find('.size-V');

			if (pathElement.length != 0) {
				// Récupère les dimensions du path
				const bbox = pathElement[0].getBBox();
				const { x, y, width, height } = bbox;

				var adjustedX = x - margin - margin / 2;
				var adjustedY = y - margin / 2;

				var adjustedWidth = 100 + margin * 2;
				var adjustedHeight = height + margin;

				var centerX, centerY;

				var offset = (adjustedWidth - margin * 2 - pathElement.width()) / 2;

				adjustedX -= offset;

				adjustedHeight += margin;

				const leftArrow = draw.find('#left-arrow');
				const rightArrow = draw.find('#right-arrow');

				const topArrow = draw.find('#top-arrow');
				const bottomArrow = draw.find('#bottom-arrow');

				var x1 = bbox.x;
				var y1 = bbox.y + bbox.height + margin;
				var x2 = bbox.x + bbox.width / 2 - margin * 2;
				var y2 = y1;

				leftArrow.attr('x1', x1);
				leftArrow.attr('y1', y1);
				leftArrow.attr('x2', x2);
				leftArrow.attr('y2', y2);

				x1 = bbox.x + bbox.width / 2 + margin * 2;
				y1 = bbox.y + bbox.height + margin;
				x2 = bbox.x + bbox.width;
				y2 = y1;

				rightArrow.attr('x1', x1);
				rightArrow.attr('y1', y1);
				rightArrow.attr('x2', x2);
				rightArrow.attr('y2', y2);

				x1 = bbox.x - margin;
				y1 = bbox.y;
				x2 = x1;
				y2 = bbox.height / 3;

				topArrow.attr('x1', x1);
				topArrow.attr('y1', y1);
				topArrow.attr('x2', x2);
				topArrow.attr('y2', y2);

				x1 = bbox.x - margin;
				y1 = bbox.height;
				x2 = x1;
				y2 = bbox.height - bbox.height / 3;

				bottomArrow.attr('x1', x1);
				bottomArrow.attr('y1', y1);
				bottomArrow.attr('x2', x2);
				bottomArrow.attr('y2', y2);

				centerX = bbox.x + bbox.width / 2;
				centerY = bbox.y + bbox.height + margin;

				sizeCMH.attr('x', centerX);
				sizeCMH.attr('y', centerY);

				sizeCMV.attr('x', 0);
				sizeCMV.attr('y', bbox.height / 2);
				sizeCMV.attr(
					'transform',
					'translate(-10,0), rotate(-90, 0, ' + bbox.height / 2 + ')'
				);

				// Ajuste la viewBox du SVG en fonction du path avec la marge
				draw.attr(
					'viewBox',
					`${adjustedX} ${adjustedY} ${adjustedWidth} ${adjustedHeight}`
				);

				centerX = bbox.x + bbox.width / 2;
				centerY = bbox.y + bbox.height / 2;

				centerText.each(function () {
					if (draw.hasClass('draws-reverse') || draw.hasClass('text-reverse')) {
						$(this).attr(
							'transform',
							'rotate(-90,' + centerX + ',' + centerY + ')'
						);
					} else {
						$(this).attr(
							'transform',
							'rotate(0,' + centerX + ',' + centerY + ')'
						);
					}
					$(this).attr('x', centerX);
					$(this).attr('y', centerY);
				});

				if (check.length != 0) {
					const gBBox = check[0].getBBox();

					const pathCenterX = bbox.x + bbox.width / 2;
					const pathCenterY = bbox.y + bbox.height / 2;

					const translateX = pathCenterX - gBBox.width / 2;
					const translateY = pathCenterY - gBBox.height / 2;

					var rotate = '';

					if (draw.hasClass('draws-reverse')) {
						rotate = 'rotate(-90,' + centerX + ',' + centerY + ')';
					}
					check.attr(
						'transform',
						rotate + ` translate(${translateX}, ${translateY})`
					);
				}
			}
		});
	};

	// document ready
	$(document).ready(function () {
		initdraws('.draws');

		$('#draws-toggle').click(function () {
			if ($('#draws-toggle').is(':checked'))
				$(".draws:not('.blocked-draws')").each(function () {
					$(this).addClass('draws-reverse');
				});
			else
				$(".draws:not('.blocked-draws')").each(function () {
					$(this).removeClass('draws-reverse');
				});
			initdraws('.draws');
		});
		$('#floral-toggle').click(function () {
			if ($('#floral-toggle').is(':checked'))
				$('#floral-form').addClass('d-none');
			else $('#floral-form').removeClass('d-none');
		});
		$('#name-toggle').click(function () {
			if ($('#name-toggle').is(':checked')) $('#name-form').addClass('d-none');
			else $('#name-form').removeClass('d-none');
		});
	});
})(jQuery);
