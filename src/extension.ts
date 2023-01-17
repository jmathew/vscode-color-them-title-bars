import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerTextEditorCommand(
    'vscode-color-them-title-bars.colorThemTitleBars',
    async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
      await colorizeTitleBar();
    }
  );
  context.subscriptions.push(disposable);

  await colorizeTitleBar();
}

// This method is called when your extension is deactivated
export function deactivate() { }

async function colorizeTitleBar() {
  if (vscode.workspace.name === undefined) {
    vscode.window.showInformationMessage('No current workspace, colorization was not applied!');
    return;
  }

  const colorCustomizationsSection = 'colorCustomizations';

  const settings = vscode.workspace.getConfiguration('workbench', vscode.workspace.workspaceFile);

  // Gotta use inspect to be able to find only the workspace settings. .get() will combine with user settings.
  const existing = settings.inspect(colorCustomizationsSection)?.workspaceValue as any;

  // If customizations already exist do nothing.
  if (
    existing["titleBar.activeBackground"] !== undefined
    || existing["titleBar.activeForeground"] !== undefined
  ) {
    vscode.window.showInformationMessage('Existing settings found for \'titleBar\', colorization was not applied!');
    return;
  }

  const background = stringToColor(vscode.workspace.name);
  const foreground = invertColor(background, true);

  await settings.update(
    colorCustomizationsSection,
    {
      ...existing,
      "titleBar.activeBackground": background,
      "titleBar.activeForeground": foreground,
    },
    vscode.ConfigurationTarget.Workspace
  );

  vscode.window.showInformationMessage('Colorized them title bars!');
}

// https://stackoverflow.com/a/16348977/730326
function stringToColor(text: string) {
  let color = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hashCode(text) >> (i * 8)) & 0xFF;
    const x = ('00' + value.toString(16));
    color += x.substring(x.length - 1);
  }
  return color;
}

function hashCode(text: string) {
  var hash = 0;
  for (var i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// https://stackoverflow.com/a/35970186/730326
function invertColor(hex: string, bw: boolean) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  const r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);

  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF';

  }
  // invert color components
  const rs = (255 - r).toString(16);
  const gs = (255 - g).toString(16);
  const bs = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(rs) + padZero(gs) + padZero(bs);
}

function padZero(str: string, len?: number) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}
