import { ExtensionContext, languages, commands, Disposable, workspace, window } from 'vscode';
import { CodelensProvider } from './CodelensProvider';

let disposables: Disposable[] = [];

const documentSelector = [{ scheme: 'file', language: 'python' }];

export function activate(context: ExtensionContext) {
	const codelensProvider = new CodelensProvider();

	languages.registerCodeLensProvider(documentSelector, codelensProvider);

	commands.registerCommand("codelens-sample.enableCodeLens", () => {
		workspace.getConfiguration("codelens-sample").update("enableCodeLens", true, true);
	});

	commands.registerCommand("codelens-sample.disableCodeLens", () => {
		workspace.getConfiguration("codelens-sample").update("enableCodeLens", false, true);
	});

	commands.registerCommand("codelens-sample.codelensAction", (args: any) => {
		window.showInformationMessage(`CodeLens action clicked with args=${args}`);
	});
}

export function deactivate() {
	if (disposables) {
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}
