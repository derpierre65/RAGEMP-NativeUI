export default class Point {
	public X: number = 0;
	public Y: number = 0;

	constructor(x: number, y: number) {
		this.X = x;
		this.Y = y;
	}

	static Parse(point: number[]): Point;
	static Parse(point: { X: number; Y: number }): Point;
	static Parse(arg): Point {
		if (typeof arg === 'object') {
			if (arg.length) {
				// Array
				return new Point(arg[0], arg[1]);
			}
			else if (arg.X && arg.Y) {
				// Object
				return new Point(arg.X, arg.Y);
			}
		}
		else if (typeof arg === 'string') {
			if (arg.includes(',')) {
				const arr = arg.split(',');
				return new Point(parseFloat(arr[0]), parseFloat(arr[1]));
			}
			else {
				let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
				if (arg === 'topRight') {
					return new Point(resolution.x - 441, 10);
				}
				else if (arg === 'bottomRight') {
					return new Point(resolution.x - 441, resolution.y - 510);
				}
				else if (arg === 'bottomLeft') {
					return new Point(0, resolution.y - 510);
				}
			}
		}
		return new Point(0, 0);
	}
}
