import Color from "../utils/Color";
import Point from "../utils/Point";
import Size from "../utils/Size";
import Text from "./Text";
import { Screen } from "../utils/Screen";

export enum Alignment {
	Left,
	Centered,
	Right
}

export default class ResText extends Text {
	public TextAlignment: Alignment = Alignment.Left;
	public DropShadow: boolean;
	public Outline: boolean;
	public Wrap: number = 0;
	public get WordWrap() {
		return new Size(this.Wrap, 0);
	}
	public set WordWrap(value) {
		this.Wrap = value.Width;
	}

	constructor(caption, pos, scale, color?, font?, justify?) {
		super(
			caption,
			pos,
			scale,
			color || new Color(255, 255, 255),
			font || 0,
			false
		);
		if (justify) this.TextAlignment = justify;
	}

	public Draw(): void;
	public Draw(offset: Size): void;
	public Draw(caption, pos, scale, color, font, arg2): void;

	Draw(
		arg1?,
		pos?,
		scale?,
		color?,
		font?,
		arg2?,
		dropShadow?,
		outline?,
		wordWrap?
	) {
		let caption = arg1;
		let centered = arg2;
		let textAlignment = arg2;
		if (!arg1) arg1 = new Size(0, 0);
		if (arg1 && !pos) {
			textAlignment = this.TextAlignment;
			caption = this.caption;
			pos = new Point(this.pos.X + arg1.Width, this.pos.Y + arg1.Height);
			scale = this.scale;
			color = this.color;
			font = this.font;
			if (centered == true || centered == false) {
				centered = this.centered;
			} else {
				centered = undefined;
				dropShadow = this.DropShadow;
				outline = this.Outline;
				wordWrap = this.WordWrap;
			}
		}

		const screenw = Screen.width;
		const screenh = Screen.height;

		const height = 1080.0;
		const ratio = screenw / screenh;
		const width = height * ratio;

		const x = this.pos.X / width;
		const y = this.pos.Y / height;

		mp.game.ui.setTextFont(parseInt(font));
		mp.game.ui.setTextScale(1.0, scale);
		mp.game.ui.setTextColour(color.R, color.G, color.B, color.A);

		if (centered !== undefined) {
			mp.game.ui.setTextCentre(centered);
		} else {
			if (dropShadow) mp.game.ui.setTextDropshadow(2, 0, 0, 0, 0);

			if (outline) console.warn("outline not working!");

			switch (textAlignment) {
				case Alignment.Centered:
					mp.game.ui.setTextCentre(true);
					break;
				case Alignment.Right:
					mp.game.ui.setTextRightJustify(true);
					mp.game.ui.setTextWrap(0.0, x);
					break;
			}

			if (this.Wrap) {
				const xsize = (this.pos.X + this.Wrap) / width;
				mp.game.ui.setTextWrap(x, xsize);
			}
		}

		mp.game.ui.setTextEntry("THREESTRINGS");
		ResText.AddLongString(caption);
		mp.game.ui.drawText(x, y);
	}

	public static AddLongString(text: string) {
		if(text.length) {
			const maxStringLength = 99;
			/*for(let i = 0; i < text.length; i += maxStringLength) {
				const substr = text.substr(i, Math.min(maxStringLength, (text.length - i) < maxStringLength ? (text.length - i) : text.lastIndexOf(' ')));
				mp.game.ui.addTextComponentSubstringPlayerName(substr);
			}*/
			for(let i = 0, position; i < text.length; i += maxStringLength) {
				let currentText = text.substr(i, i + maxStringLength);
				let currentIndex = i;
				if((currentText.match(/~/g)||[]).length % 2 !== 0) {
					position = currentText.lastIndexOf('~');
					//if(position > 0 && currentText[position - 1] === ' ') { // Doesn't the substring auto add a space?
					//	position--;
					//}
					i -= (maxStringLength - position);
				} else {
					position = Math.min(maxStringLength, text.length - currentIndex);
				}
				mp.game.ui.addTextComponentSubstringPlayerName(text.substr(currentIndex, position));
			}
		}
	}
}