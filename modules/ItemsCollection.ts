import ListItem from '../modules/ListItem';

export default class ItemsCollection {
	protected readonly _items: ListItem[];

	constructor(items: ListItem[] | string[] | number[] | { [index: string]: any }) {
		if (items.length === 0) {
			throw new Error('ItemsCollection cannot be empty');
		}

		let tmpItems = [];
		if (Array.isArray(items)) {
			for (let item of items) {
				if (item instanceof ListItem) {
					tmpItems.push(item);
				}
				else if (typeof item == 'string' || typeof item === 'number') {
					tmpItems.push(new ListItem(item.toString()));
				}
			}
		}
		else {
			let keys = Object.keys(items);
			for (let key of keys) {
				tmpItems.push(new ListItem(items[key], key));
			}
		}

		if (tmpItems.length === 0) {
			throw new Error('ItemsCollection cannot be empty');
		}
		this._items = tmpItems;
	}

	get Items() {
		return this._items;
	}

	/** @deprecated (use Items.length) */
	public length() {
		return this._items.length;
	}

	/** @deprecated */
	public getListItems() {
		return this._items;
	}
}
