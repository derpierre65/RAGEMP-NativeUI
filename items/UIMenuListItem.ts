import BadgeStyle from '../enums/BadgeStyle';
import Font from '../enums/Font';
import ItemsCollection from '../modules/ItemsCollection';
import ListItem from '../modules/ListItem';
import ResText, {Alignment} from '../modules/ResText';
import Sprite from '../modules/Sprite';
import Color from '../utils/Color';
import LiteEvent from '../utils/LiteEvent';
import Point from '../utils/Point';
import Size from '../utils/Size';
import {Screen} from '../utils/Screen';
import UIMenuItem from './UIMenuItem';

export default class UIMenuListItem extends UIMenuItem {
	protected _itemText: ResText;
	protected _arrowLeft: Sprite;
	protected _arrowRight: Sprite;
	protected _index: number = 0;
	private currOffset: number = 0;
	private collection: Array<ListItem> = [];

	constructor(text: string, description: string = '', collection: ItemsCollection = new ItemsCollection([]), startIndex: number = 0, data: any = null) {
		super(text, description, data);

		let y = 0;
		this.Collection = collection.Items;
		this.Index = startIndex;
		this._arrowLeft = new Sprite('commonmenu', 'arrowleft', new Point(110, 105 + y), new Size(30, 30));
		this._arrowRight = new Sprite('commonmenu', 'arrowright', new Point(280, 105 + y), new Size(30, 30));
		this._itemText = new ResText('', new Point(290, y + 104), 0.35, Color.White, Font.ChaletLondon, Alignment.Right);
	}

	public setCollection(collection: ItemsCollection) {
		this.Collection = collection.Items;
	}

	public setCollectionItem(index: number, item: ListItem | string, resetSelection: boolean = true) {
		if (index > this.Collection.length) {
			throw new Error('Index out of bounds');
		}
		if (typeof item === 'string') {
			item = new ListItem(item);
		}

		this.Collection.splice(index, 1, item);

		if (resetSelection) {
			this.Index = 0;
		}
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

		const caption = this.Collection.length >= this.Index
			? this.Collection[this.Index].DisplayText
			: ' ';
		const offset = this.currOffset;

		this._itemText.color = this.Enabled
			? this.Selected
				? this.HighlightedForeColor
				: this.ForeColor
			: new Color(163, 159, 148);

		this._itemText.caption = caption;

		let arrowColor = this.Selected ? Color.Black : Color.WhiteSmoke;
		if (!this.Enabled) {
			arrowColor = new Color(163, 159, 148);
		}

		this._arrowLeft.color = arrowColor;
		this._arrowRight.color = arrowColor;
		this._arrowLeft.pos = new Point(390 - offset + this.Offset.X + this.Parent.WidthOffset, /* 375*/ this._arrowLeft.pos.Y);

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

	get Value() {
		return this.Collection[this.Index].Data;
	}

	get Collection() {
		return this.collection;
	}

	set Collection(v) {
		if (!v) {
			throw new Error('The collection can\'t be null');
		}
		this.collection = v;
	}

	set SelectedItem(v: ListItem) {
		const idx = this.Collection.findIndex(li => li.Id === v.Id);
		this.Index = idx > 0 ? idx : 0;
	}

	get SelectedItem() {
		return this.Collection.length > 0 ? this.Collection[this.Index] : null;
	}

	get SelectedValue() {
		return this.SelectedItem == null
			? null
			: this.SelectedItem.Data == null
				? this.SelectedItem.DisplayText
				: this.SelectedItem.Data;
	}

	get Index() {
		if (this.Collection == null || this.Collection.length == 0) {
			return -1;
		}

		return this._index % this.Collection.length;
	}

	set Index(value) {
		if (this.Collection == null || this.Collection.length == 0) {
			return;
		}

		this._index = 100000 - (100000 % this.Collection.length) + value;

		const caption = this.Collection.length >= this.Index
			? this.Collection[this.Index].DisplayText
			: ' ';
		this.currOffset = Screen.GetTextWidth(caption, this._itemText && this._itemText.font ? this._itemText.font : 0, 0.35);
		// this._itemText && this._itemText.font ? this._itemText.font : 0, this._itemText && this._itemText.scale ? this._itemText.scale : 0.35
	}
}
