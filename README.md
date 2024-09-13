
# Python Colorful Print - VSCode Extension

![Version](https://img.shields.io/badge/version-0.1.6-blue)
![VSCode](https://img.shields.io/badge/VSCode-1.75.0+-brightgreen.svg)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![Mocha Tests](https://img.shields.io/badge/tests-passing-brightgreen)


<p align="center">
  <img src="https://github.com/AliYmn/python-colorful-print/raw/main/images/logo.png" alt="FFB Logo" width="200" height="200">
</p>

## Overview

`python-colorful-print` is a VSCode extension that enhances Python print statements by adding customizable colors to both variable names (keys) and their values. You can choose specific colors for your prints, generate random colors, and also remove or print all variables in your current Python file with ease.

<p align="center">
  <img src="https://github.com/AliYmn/python-colorful-print/raw/main/images/pcp-demo.gif" alt="FFB Logo">
</p>

## Features

- **Colorful Print Statements:** Automatically inserts `print()` statements for selected variables in your Python code, with customizable color formatting.
- **Print All Variables:** Inserts print statements for all variables defined in the active Python file.
- **Remove All Print Statements:** Removes all existing print statements in the current file.
- **Random Colors:** Choose random colors for variable names and values.
- **Disable Colors:** Option to disable colors and print statements in standard format.

## Installation

1. Download and install [Visual Studio Code](https://code.visualstudio.com/).
2. Install the extension by cloning the repository or by adding it to the VSCode marketplace (if applicable).

```bash
git clone https://github.com/AliYmn/python-colorful-print.git
```

3. Open the cloned repository in VSCode.

4. Install the required dependencies:

```bash
npm install
```

5. Open the Command Palette (`Ctrl+Shift+P`) and run the extension.

## Usage

### 1. Inserting a Colorful Print for Selected Variables

- Select a variable in your Python file.
- Run the command `Colorful Print` from the Command Palette (`Ctrl+Shift+L` on Windows/Linux, `Cmd+Shift+L` on Mac).
- A colorized `print()` statement will be inserted for the selected variable, with the variable name and value displayed in different colors.

### 2. Printing All Variables

- Run the command `Print All Variables` from the Command Palette (`Ctrl+Shift+A` on Windows/Linux, `Cmd+Shift+A` on Mac).
- This will insert a print statement for every variable defined in the file.

### 3. Removing All Print Statements

- Run the command `Remove All Print Statements` from the Command Palette (`Ctrl+Shift+R` on Windows/Linux, `Cmd+Shift+R` on Mac).
- This will remove all `print()` statements from the active file.

### 4. Configuring Colors

- You can configure the colors for variable names and values through the extension's settings.
  - **Key (Variable Name) Color:** Set your preferred color for the variable name.
  - **Value Color:** Set your preferred color for the variable value.
  - **Random Colors:** Set colors to random for variable names and values.
  - **Disable Colors:** Disable colorized output and print in default formatting.

## Contributions

Contributions are always welcome! If you'd like to contribute, please open a pull request or issue on the [GitHub repository](https://github.com/AliYmn/python-colorful-print).

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
