# Overview

Colorize the title bars of your open editors to find them easily in the task switcher. Colors are derived from the workspace name to ensure consistent colors. Don't like the chosen color? Check your workspace settings file and update the colors as desired.

Activate by using command 'Color This Top Bar'. Or go to settings and turn on 'Apply on Start' to automatically colorize the top bar on start.

## Features

* Adds new command to colorize the title bar of the current editor instance.
* Option to automatically colorize instances on start.
* Does not override existing color settings.

## Troubleshooting / FAQ
* Colorization was skipped on a project I'd like to colorize.
  * Colorization will be skipped if any of the following settings are set in the project's `settings.json`. Delete or comment out the entries and reload the window to make the colorization apply. 
    * `titleBar.activeBackground`
    * `titleBar.activeForeground`
    * `titleBar.inactiveBackground`

## Release Notes

### 0.0.1

Initial release.

### 0.0.2

Fixed extension not working when workspace settings are empty.