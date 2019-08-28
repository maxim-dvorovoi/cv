var lastMove = null;
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function showPage() {
	document.getElementById('loader').style.display = 'none';
	document.getElementById('index').className = 'main-active';
	document.addEventListener('scroll', onScroll);
	document.addEventListener('click', onClick);
	document.addEventListener('touchstart', onTouchStart, { passive: false });
}

function onScroll() {
	if (window.innerWidth > 962) return;

	var className = document.getElementById('burger').className;
	if (document.getElementById('banner').offsetHeight > scrollTop()) {
		if (className !== 'burger') document.getElementById('burger').className = 'burger';
		return;
	}

	if (className !== 'burger-black') document.getElementById('burger').className = 'burger-black';
}

function onClick(e) {
	if (window.innerWidth > 962 || document.getElementById('header').className === 'header') return;

	var tags = e.path.filter(isTagHeader);
	if (tags.length) return;

	e.preventDefault();
	document.getElementById('header').className = 'header';
}

function onTouchStart(e) {
	if (window.innerWidth > 962 || !e.touches || !e.touches.length) return;

	var touch = e.touches[0];
	var className = document.getElementById('index').className;

	if (className === 'main-active' && (window.innerWidth - 20 > touch.clientX || touch.clientY < 40)) return;
	if (className === 'main-active sidebar' && window.innerWidth - 210 < touch.clientX) {
		document.addEventListener('touchmove', onTouchMovePrevent, { passive: false });
		document.addEventListener('touchend', onTouchEnd);
		return;
	}

	lastMove = e;
	if (e.cancelable) e.preventDefault();

	document.getElementById('header').style.transition = '0s';
	document.addEventListener('touchmove', onTouchMove);
	document.addEventListener('touchend', onTouchEnd);
}

function onTouchMovePrevent(e) {
	e.preventDefault();
}

function onTouchMove(e) {
	lastMove = e;
	if (!e.touches || !e.touches.length) return;

	var x = (window.innerWidth - e.touches[0].clientX) > 210 ? -210 : e.touches[0].clientX - window.innerWidth;
	document.getElementById('header').style.transform = 'translateX(' + x + 'px)';
}

function onTouchEnd(e) {
	var className = document.getElementById('index').className;
	if (className === 'main-active sidebar' && e.target.id === 'header') return;

	document.removeEventListener('touchmove', onTouchMove);
	document.removeEventListener('touchend', onTouchEnd);
	document.removeEventListener('touchmove', onTouchMovePrevent);
	document.getElementById('header').removeAttribute("style");

	if ((e.target && e.target.id === 'burger') || (e.target.offsetParent && e.target.offsetParent.id === 'burger')) return;
	if (className === 'main-active' && lastMove && window.innerWidth - 20 < lastMove.touches[0].clientX) return;

	showHideHeader();
}

function showHideHeader() {
	var className = document.getElementById('index').className;
	className = className === 'main-active sidebar' ? 'main-active' : 'main-active sidebar';
	document.getElementById('index').className = className;
}

function isTagHeader(item) {
	return item.id === 'burger' || item.id === 'header';
}

function scrollTop() {
	return window.scrollY != null ? window.scrollY : window.pageYOffset;
}

function scrollToTag(id) {
	disableScroll();
	var clientY = scrollTop();
	var tagY = document.getElementById(id).offsetTop - 10;
	if (window.innerWidth > 962) tagY = tagY - 40;

	animate({
		duration: 1000,
		timing: makeEaseInOut(quad),
		draw: function(progress) {
			window.scrollTo({top: clientY - (clientY - tagY) * progress});
			if (progress === 1) enableScroll();
		}
	});
}

function animate(options) {
	var start = performance.now();

	requestAnimationFrame(function animate(time) {
		var timeFraction = (time - start) / options.duration;
		if (timeFraction > 1) timeFraction = 1;

		var progress = options.timing(timeFraction);
		options.draw(progress);

		if (timeFraction < 1) requestAnimationFrame(animate);
	});
}

function makeEaseInOut(timing) {
	return function(timeFraction) {
		if (timeFraction < .5) return timing(2 * timeFraction) / 2;

		return (2 - timing(2 * (1 - timeFraction))) / 2;
	}
}

function quad(timeFraction) {
	return Math.pow(timeFraction, 2);
}

function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault) e.preventDefault();

	e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
	if (!keys[e.keyCode]) return;

	preventDefault(e);
	return false;
}

function disableScroll() {
	document.addEventListener('DOMMouseScroll', preventDefault, false);
	document.addEventListener('wheel', preventDefault, {passive: false});
	document.addEventListener('mousewheel', preventDefault, {passive: false});
	document.addEventListener('onmousewheel', preventDefault, {passive: false});
	document.addEventListener('MozMousePixelScroll', preventDefault, {passive: false});

	document.addEventListener('onkeydown', preventDefaultForScrollKeys, {passive: false});
	document.addEventListener('touchmove', preventDefault, {passive: false});
}

function enableScroll() {
	document.removeEventListener('DOMMouseScroll', preventDefault, false);
	document.removeEventListener('wheel', preventDefault, {passive: false});
	document.removeEventListener('mousewheel', preventDefault, {passive: false});
	document.removeEventListener('onmousewheel', preventDefault, {passive: false});
	document.removeEventListener('MozMousePixelScroll', preventDefault, {passive: false});

	document.removeEventListener('onkeydown', preventDefaultForScrollKeys, {passive: false});
	document.removeEventListener('touchmove', preventDefault, {passive: false});
}