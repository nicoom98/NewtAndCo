var angle = 55,
	dx = -10,
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

			if (medal.attr('id') == 'gradient-color') {

				var gradientPattern = $('#gradientPattern')[0];



				gradientPattern.setAttribute('x1', adjustedX);
				gradientPattern.setAttribute('y1', centerY);
				gradientPattern.setAttribute('x2', adjustedWidth + adjustedX);
				gradientPattern.setAttribute('y2', centerY);
			}

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

function initMedalGradient() {
	const data1 = $('#gradient-motifPicker1').val();
	const data2 = $('#gradient-motifPicker2').val();

	if (data1[0] == '#' || data1 == 'transparent') {
		$('#color1-pattern > rect:first-child').attr('fill', data1);
		$('#gradient-pattern > rect:nth-child(1)').attr(
			'fill',
			"url('#color1-pattern')"
		);
	} else {
		$('#image1-pattern > image').attr('href', data1);
		$('#gradient-pattern > rect:nth-child(1)').attr(
			'fill',
			"url('#image1-pattern')"
		);
	}

	if (data2[0] == '#' || data2 == 'transparent') {
		$('#color2-pattern > rect:first-child').attr('fill', data2);
		$('#gradient-pattern > rect:nth-child(2)').attr(
			'fill',
			"url('#color2-pattern')"
		);
	} else {
		$('#image2-pattern > image').attr('href', data2);
		$('#gradient-pattern > rect:nth-child(2)').attr(
			'fill',
			"url('#image2-pattern')"
		);
	}

	refreshMedals();
}
function initMedalMotif() {
	const imageMotif = $('input[name="motif"]:checked').val();
	$('#motifPattern image').attr('href', imageMotif);

	refreshMedals();
}
function initMedalCustoColor() {
	const color = $('#custo-colorPicker').val();
	$('#imagePattern > g:first-child').css('fill', color);
	$('.front-text').css('fill', color);
	$('.back-text').css('fill', color);

	refreshMedals();
}
function initMedalSplitter() {
	const imageSplitter = $('input[name="splitter"]:checked').val();
	if (imageSplitter == '') {
		$('#splitter').attr('fill', 'none');
	} else {
		$('#splitter').attr('fill', 'url(#splitterPattern)');
		$('#splitterPattern image').attr('href', imageSplitter);
	}

	refreshMedals();
}
function positionRectangles() {
	// Récupérer les dimensions du viewBox
	const svg = $('#gradient-colorSVG')[0];
	const viewBox = svg.viewBox.baseVal;
	const svgWidth = viewBox.width;

	// Dimensions des rectangles
	const rectWidth = svgWidth / 2; // Chaque rectangle prend la moitié du SVG

	x1 = rectWidth + viewBox.x;
	x2 = x1;
	y1 = 0;
	y2 = viewBox.height - margin * 2;

	// Positionnement
	$('#gradient-pattern rect:nth-child(1)').attr({
		x: -rectWidth + 0.1, // Le rectangle gauche commence à gauche
		y: viewBox.y - margin / 2,
	});

	$('#gradient-pattern rect:nth-child(2)').attr({
		x: rectWidth + viewBox.x, // Le rectangle droit commence à la moitié du SVG
		y: viewBox.y - margin / 2,
	});
	$('#gradient-pattern rect:nth-child(3)').attr({
		x: rectWidth + viewBox.x - 2,
		y: viewBox.y - margin / 2,
	});
}
function getTransformedCoordinates(line) {
	let svg = document.getElementById('gradient-colorSVG');

	// Matrice de transformation complète de la ligne
	let matrix = line.getCTM();

	if (!matrix) return null;  // Sécurité

	// Convertir les coordonnées en repère SVG
	let inverseMatrix = svg.getCTM().inverse(); // Inversion pour revenir aux coordonnées SVG

	// Fonction pour transformer un point
	function transformPoint(x, y) {
		let point = svg.createSVGPoint();
		point.x = x;
		point.y = y;
		let transformedPoint = point.matrixTransform(matrix); // Appliquer la transformation
		return transformedPoint.matrixTransform(inverseMatrix); // Revenir aux coordonnées SVG
	}

	// Récupérer les coordonnées originales de la ligne
	let x1 = parseFloat(line.getAttribute('x1'));
	let y1 = parseFloat(line.getAttribute('y1'));
	let x2 = parseFloat(line.getAttribute('x2'));
	let y2 = parseFloat(line.getAttribute('y2'));

	// Appliquer la transformation aux coordonnées
	let p1 = transformPoint(x1, y1);
	let p2 = transformPoint(x2, y2);

	return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
}


function moveRectangles() {
	var leftRect = $('#gradient-pattern rect:nth-child(1)');
	var splitter = $('#gradient-pattern rect:nth-child(3)');
	var rightRect = $('#gradient-pattern rect:nth-child(2)');

	var line = $('#gradient-color > line')

	// Appliquer les coordonnées transformées à la nouvelle ligne
	line.attr('x1', x1);
	line.attr('y1', y1);
	line.attr('x2', x2);
	line.attr('y2', y2);

	const svg = $('#gradient-colorSVG')[0];
	const viewBox = svg.viewBox.baseVal;
	const centerX = viewBox.x + viewBox.width / 2;
	const centerY = viewBox.y + viewBox.height / 2;
	var rotate = ` rotate(${angle} ${centerX} ${centerY}) `;

	var translate = ` translate(${dx} ${dy}) `;

	leftRect.attr('transform', rotate + translate);
	rightRect.attr('transform', rotate + translate);
	splitter.attr('transform', rotate + translate);

	line.attr('transform', rotate + translate);



	let transformedCoords = getTransformedCoordinates(line[0]);

	if (transformedCoords) {

		if (transformedCoords.x2 - transformedCoords.x1 === 0) {
			// Cas ligne verticale
			a = Infinity;
			b = transformedCoords.x1; // X fixe
		} else {
			// Cas général
			a = (transformedCoords.y2 - transformedCoords.y1) / (transformedCoords.x2 - transformedCoords.x1);
			b = transformedCoords.y1 - a * transformedCoords.x1;
		}
	}


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

	if ($(this).attr('id') == 'gradient-color') {
		var side;

		const svg = event.target.closest('svg');
		const pt = svg.createSVGPoint();
		pt.x = event.clientX;
		pt.y = event.clientY;

		const viewBox = svg.viewBox.baseVal;
		const centerX = viewBox.x + viewBox.width / 2;

		const svgCoords = pt.matrixTransform(svg.getScreenCTM().inverse());
		const { x, y } = svgCoords;

		if (a === Infinity) {
			side = x < b ? "left" : "right";
		} else {
			let expectedY = a * x + b;
			side = y < expectedY ? "left" : "right";
		}

		side = (Math.floor(angle / 180) % 2 === 0) ? side : (side === "left" ? "right" : "left");



		$('#colorPick').attr('side', side);
	}

	event.stopPropagation();
}
function switchPopupCusto(event) {
	$('#colorPick').removeClass('active');

	var offset = $('#colorPickCusto').width() * 0.25;

	$('#colorPickCusto').css(
		'left',
		event.clientX + window.scrollX - offset - 5 + 'px'
	);
	$('#colorPickCusto').css('top', event.clientY + window.scrollY + 5 + 'px');
	$('#colorPickCusto').addClass('active');

	event.stopPropagation();
}
function updateMedalColor() {
	var medal = $('#colorPick').attr('medal');

	var data = $(this).attr('value');

	if (medal == 'single-color') {
		$('#single-colorPicker').val(data);
		initMedalColor();
	} else if (medal == 'gradient-color') {
		if ($('#colorPick').attr('side') == 'left') {
			$('#gradient-motifPicker1').val(data);
		} else if ($('#colorPick').attr('side') == 'right') {
			$('#gradient-motifPicker2').val(data);
		}
		initMedalGradient();
	}

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
	initMedalGradient();
	initMedalMotif();
	initMedalSplitter();
	initMedalCustoColor();
	positionRectangles();
	moveRectangles();
	//animate();

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

	$('#front-toggle').click(function () {



		if ($(this).is(':checked')) {
			$('#front-text-form').hide();
			$('#front-image-form').show();
		} else {
			$('#front-text-form').show();
			$('#front-image-form').hide();
		}

	});
	$('#back-toggle').click(function () {

		if ($(this).is(':checked')) {

			$('#back-text-form').hide();
			$('#back-image-form').show();
		} else {
			$('#back-text-form').show();
			$('#back-image-form').hide();
		}

	});

	$("input[name='motif']").click(initMedalMotif);

	$("input[name='splitter']").click(initMedalSplitter);

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

	$('input[name="shape"]').on('change', function () {

		var path = ($("#" + $(this).val()).find('path').attr('d'));

		$('.medal-size').each(function () {

			$(this).find('path:first').attr('d', path);
		});
		$('.medal-color').each(function () {
			$(this).find('path').attr('d', path);
		});
		$('.medal-custo').each(function () {
			$(this).find('path').attr('d', path);
		});
		$('#monSVG').find('path').attr('d', path)

		$('.step-content').show();
		$('#front-text-form').css('display', 'flex');
		$('#back-text-form').css('display', 'flex');
		$('#front-image-form').css('display', 'flex');
		$('#back-image-form').css('display', 'flex');
		initMedals('.medals');
		$('.step-content:not(.active)').hide();
		$('#front-toggle').click();
		$('#back-toggle').click();
		$('#front-toggle').click();
		$('#back-toggle').click();

	});
});

