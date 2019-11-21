export default abstract class CustomVariables {
	private _customVariables: { [index: string]: any } = {};

	setVariable(variableName: string, value: any) {
		this._customVariables[variableName] = value;
	}

	setVariables(variables: { [index: string]: any }) {
		for (let key in variables) {
			if (variables.hasOwnProperty(key)) {
				this.setVariable(key, variables[key]);
			}
		}
	}

	getVariable(variableName: string) {
		return this._customVariables[variableName] || null;
	}

	deleteVariable(variableName: string) {
		delete this._customVariables[variableName];
	}
}