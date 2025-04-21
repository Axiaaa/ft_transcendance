export function throttle(func: Function) {
	let lastArgs: any[] | null = null;
	let frameFlag: boolean = false;

	return function(this: any, ...args: any[]) {
		lastArgs = args;

		if (!frameFlag) {
			frameFlag = true;

			requestAnimationFrame(() => {
				if (lastArgs) {
					func.apply(this, lastArgs);
					lastArgs = null;
				}
				frameFlag = false;
			});
		}
	};
}
