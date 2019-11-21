import ListItem from '../modules/ListItem';

export default class ItemsCollection {
	private items: any[];

	constructor(items: any[]) {
		this.items = items;
		if (this.getListItems().length === 0) {
			throw new Error('ItemsCollection cannot be empty');
		}
	}

	public length() {
		return this.items.length;
	}

	public getListItems() {
		const items = [];
		for (const item of this.items) {
			if (item instanceof ListItem) {
				items.push(item);
			}
			else if (typeof item == 'string' || typeof item === 'number') {
				items.push(new ListItem(item.toString()));
			}
		}
		return items;
	}
}
