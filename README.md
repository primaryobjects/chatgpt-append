# ChatGPT Append

Saves all source code files in your project to a list of text files for copying/pasting into ChatGPT.

[Install](https://marketplace.visualstudio.com/items?itemName=primaryobjects.chatgpt-append) in VsCode.

The perfect minimialistic tool to allow ChatGPT to analyze your project's source code.

*Created with ChatGPT4!*

![Screenshot of VSCode extension ChatGPT Append](images/screenshot.gif)

## Quick Start

1. Open your VSCode project.
2. Press the hotkey `F1`.
3. Run the command `ChatGPT Append`. A list of text files will be saved with all of your project's source code appended.
4. Copy and paste each file contents into the ChatGPT conversation prompt to have it analyze your code.

You can now ask questions and have the AI develop your code for you!

## Running on a Single File

Right-click the file in the left-side nav and select the menu option `ChatGPT Append`.

## Features

- Saves all source code files in your project to a concatencated list of text files.
- Configurable maximum number of characters per file.
- Configurable destination folder.

## Extension Settings

This extension uses the following settings:

* `chatgptAppend.maxFileSize`: Max number of characters per file. Default is `2000`.
* `chatgptAppend.folderName`: Destination folder to save files. Default is `chatgpt_append_files`.
* `chatgptAppend.ignoreFiles`: List of filenames or wildcards to ignore.

## License

MIT

## Author

Kory Becker http://www.primaryobjects.com/kory-becker
