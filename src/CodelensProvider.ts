import * as vscode from 'vscode';

export class Kind {
	static function = 11;
}

export class ReferencesCodeLens extends vscode.CodeLens {
	constructor(public document: vscode.TextDocument, public range: vscode.Range) {
		super(range);
	}
}

/**
 * CodelensProvider
 */
export class CodelensProvider implements vscode.CodeLensProvider {

	private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;
	public static readonly cancelledCommand: vscode.Command = {
		// Cancellation is not an error. Just show nothing until we can properly re-compute the code lens
		title: '',
		command: ''
	};

	constructor() {
		vscode.workspace.onDidChangeConfiguration((_) => {
			this._onDidChangeCodeLenses.fire();
		});
	}

	

	/**
	 * Creates all the potential references in the document, and returns them as an array of CodeLens objects. 
	 * It does not resolve the CodeLens objects with detailed information.
	 * @param document 
	 * @param token 
	 * @returns 
	 */
	async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<ReferencesCodeLens[]>{

		const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', document.uri);
        if (!symbols) {
            return [];
        }

		const referenceableSpans: vscode.Range[] = [];
		this.traverseSymbols(symbols, referenceableSpans);
		
		return referenceableSpans.map(range => new ReferencesCodeLens(document, range));
	}

	async resolveCodeLens(codeLens: ReferencesCodeLens, token: vscode.CancellationToken) {
		const document = codeLens.document;
        const position = codeLens.range.start;

		const references = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeReferenceProvider', codeLens.document.uri, codeLens.range.start);

		if (!references) {
			codeLens.command = CodelensProvider.cancelledCommand;
			return;
		}

		const locations = references.filter(reference => !reference.range.isEqual(codeLens.range)); // .map(reference => reference.range);

		if (locations.length === 0) {
			codeLens.command = CodelensProvider.cancelledCommand;
			return;
		}

		codeLens.command = {
			title: locations.length === 1 ? "1 reference" : `${locations.length} locations`,
			command: locations.length ? "editor.action.showReferences" : "",
			arguments: [document.uri, position, locations]
		};
		return codeLens;
	}

	private traverseSymbols(symbols: vscode.DocumentSymbol[], referenceableSpans: vscode.Range[]) {
		for (const symbol of symbols) {
			const range = this.verifySymbol(symbol);
			if (range) {
				referenceableSpans.push(range);

				if (symbol.children) {
					this.traverseSymbols(symbol.children, referenceableSpans);
				}
			}
		}
	}

	private verifySymbol(symbol: vscode.DocumentSymbol): vscode.Range | undefined {
		switch (symbol.kind) {
			case vscode.SymbolKind.Function:
				return symbol.selectionRange;
			case vscode.SymbolKind.Method:
				return symbol.selectionRange;
			case vscode.SymbolKind.Class:
				return symbol.selectionRange;
		}
		
		return undefined;
	}
}



