import BadgeStyle from '../enums/BadgeStyle';
import Font from '../enums/Font';
import ResText, {Alignment} from '../modules/ResText';
import Sprite from '../modules/Sprite';
import Color from '../utils/Color';
import LiteEvent from '../utils/LiteEvent';
import Point from '../utils/Point';
import Size from '../utils/Size';
import {Screen} from '../utils/Screen';
import UIMenuItem from './UIMenuItem';

export default class UIMenuDynamicListItem extends UIMenuItem {
	protected _itemText: ResText;

	protected _arrowLeft: Sprite;
	protected _arrowRight: Sprite;

	private currOffset: number = 0;

	private _leftMoveThreshold: number = 1;
	private _rightMoveThreshold: number = 1;

	private _lowerThreshold: number = 0;
	private _upperThreshold: number = 10;

	private _preText: string = '';
	private _postText: string = '';

	private _value: number;

	constructor(text: string, description: string = '', lowerThreshold: number = 0, upperThreshold: number = 10, startValue: number = 0, data = null) {
		super(text, description, data);

		let y = 0;
		this.LowerThreshold = lowerThreshold;
		this.UpperThreshold = upperThreshold;
		this.SelectedValue = (startValue < lowerThreshold || startValue > upperThreshold) ? lowerThreshold : startValue;
		this._arrowLeft = new Sprite('commonmenu', 'arrowleft', new Point(110, 105 + y), new Size(30, 30));
		this._arrowRight = new Sprite('commonmenu', 'arrowright', new Point(280, 105 + y), new Size(30, 30));
		this._itemText = new ResText('', new Point(290, y + 104), 0.35, Color.White, Font.ChaletLondon, Alignment.Right);
	}

	private readonly OnDynamicListChange = new LiteEvent();

	public get DynamicListChange() {
		return this.OnDynamicListChange.expose();
	}

	public SetVerticalPosition(y: number) {
		this._arrowLeft.pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
		this._arrowRight.pos = new Point(400 + this.Offset.X + this.Parent.WidthOffset, 147 + y + this.Offset.Y);
		this._itemText.pos = new Point(300 + this.Offset.X + this.Parent.WidthOffset, y + 147 + this.Offset.Y);
		super.SetVerticalPosition(y);
	}

	public SetRightLabel(text: string) {
		return this;
	}

	public SetRightBadge(badge: BadgeStyle) {
		return this;
	}

	public Draw() {
		super.Draw();
		const offset = this.currOffset;

		this._itemText.color = this.Enabled
			? this.Selected
				? this.HighlightedForeColor
				: this.ForeColor
			: new Color(163, 159, 148);

		this._itemText.caption = this.Text;

		this._arrowLeft.color = this.Enabled
			? this.Selected
				? this.HighlightedForeColor
				: this.ForeColor
			: new Color(163, 159, 148);
		this._arrowRight.color = this.Enabled
			? this.Selected
				? this.HighlightedForeColor
				: this.ForeColor
			: new Color(163, 159, 148);

		this._arrowLeft.pos = new Point(
			390 - offset + this.Offset.X + this.Parent.WidthOffset, // 375
			this._arrowLeft.pos.Y
		);

		if (this.Selected) {
			this._arrowLeft.Draw();
			this._arrowRight.Draw();
			this._itemText.pos = new Point(
				405 + this.Offset.X + this.Parent.WidthOffset,
				this._itemText.pos.Y
			);
		}
		else {
			this._itemText.pos = new Point(
				420 + this.Offset.X + this.Parent.WidthOffset,
				this._itemText.pos.Y
			);
		}
		this._itemText.Draw();
	}

	private _recalculateOffset() {
		this.currOffset = Screen.GetTextWidth(
			this.Text,
			this._itemText && this._itemText.font ? this._itemText.font : 0,
			this._itemText && this._itemText.scale ? this._itemText.scale : 0.35
		);
	}

	get Text() {
		return this.PreCaptionText + this._value.toString() + this.PostCaptionText;
	}

	get PostCaptionText() {
		return this._postText;
	}

	set PostCaptionText(text) {
		if (typeof text !== 'string') {
			throw new Error('The pre caption text must be a string');
		}
		this._postText = text;
		this._recalculateOffset();
	}

	get PreCaptionText() {
		return this._preText;
	}

	set PreCaptionText(text) {
		if (typeof text !== 'string') {
			throw new Error('The pre caption text must be a string');
		}
		this._preText = text;
		this._recalculateOffset();
	}

	get LeftMoveThreshold() {
		return this._leftMoveThreshold;
	}

	set LeftMoveThreshold(amt) {
		if (!amt) {
			throw new Error('The left threshold can\'t be null');
		}
		this._leftMoveThreshold = amt;
	}

	get RightMoveThreshold() {
		return this._rightMoveThreshold;
	}

	set RightMoveThreshold(amt) {
		if (!amt) {
			throw new Error('The right threshold can\'t be null');
		}
		this._rightMoveThreshold = amt;
	}

	get LowerThreshold() {
		return this._lowerThreshold;
	}

	set LowerThreshold(amt) {
		if (typeof amt !== 'number' && !amt) {
			throw new Error('The lower threshold can\'t be null');
		}
		this._lowerThreshold = amt;
		if (this.SelectedValue < amt) {
			this.SelectedValue = amt;
		}
	}

	get UpperThreshold() {
		return this._upperThreshold;
	}

	set UpperThreshold(amt) {
		if (typeof amt !== 'number' && !amt) {
			throw new Error('The upper threshold can\'t be null');
		}
		this._upperThreshold = amt;
		if (this.SelectedValue > amt) {
			this.SelectedValue = amt;
		}
	}

	get SelectedValue() {
		return this._value;
	}

	set SelectedValue(v: number) {
		if (v < this._lowerThreshold || v > this._upperThreshold) {
			throw new Error('The value can not be outside the lower or upper limits');
		}

		this._value = v;
		this._recalculateOffset();
	}
}