function average(array) {
	return array.reduce((previous, current) => current += previous)/array.length;
}

function avg100(array) {
	return Math.round((array.reduce((previous, current) => current += previous)/array.length)/255*100);
}

function avg1(array) {
	return ((array.reduce((previous, current) => current += previous)/array.length)/255).toFixed(1);
}

function RGBA(r, g, b, a) {
	return "rgba("+r+","+g+","+b+","+a+")";
}

function HSL(h, s, l) {
	return "hsl("+h+","+s+"%,"+l+"%)";
}