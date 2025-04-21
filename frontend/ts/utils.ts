export function throttle(func: Function) {
	let inThrottle: boolean;
	return function(this: any, ...args: any[]) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, 16);
		}
	};
}
