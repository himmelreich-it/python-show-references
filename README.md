# Python Show References CodeLens

This extension show references in Python using CodeLens API just like the default Typescript version.

It uses the CodeLens Provider from Visual Studio code together with the built-in references functionality.
- [`CodeLensProvider`](https://code.visualstudio.com/api/references/vscode-api#CodeLensProvider)
- [`CodeLensProvider.provideCodeLenses`](https://code.visualstudio.com/api/references/vscode-api#CodeLensProvider.provideCodeLenses)
- [`CodeLensProvider.resolveCodeLens`](https://code.visualstudio.com/api/references/vscode-api#CodeLensProvider.resolveCodeLens)

## Testing the extension

- Run `yarn install` in terminal to install dependencies
- Run the `Run Extension` target in the Debug View. This will:
	- Start a task `npm: watch` to compile the code
	- Run the extension in a new VS Code window

## Todo:
- Make sure it starts after Python plugin has loaded
- Verify performance and load
- Test in real use...