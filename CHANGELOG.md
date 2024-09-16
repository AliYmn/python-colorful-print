
# Changelog

All notable changes to the "python-colorful-print" extension will be documented in this file.

This project adheres to [Keep a Changelog](http://keepachangelog.com/) principles.

## [Unreleased]
### Added
- Added support for color-coded print statements in Python based on variable names and values.
- Implemented configurable key and value colors for print statements using hex codes.
- Introduced line number information to the print output for easier debugging.
- Included options to enable/disable the display of variable types in print statements.
- Added date stamp functionality to print outputs, configurable in settings.
- Provided option to remove all print statements automatically.

### Fixed
- Fixed an issue where print statements were not properly removed when the "removeAllPrints" command was executed.

### Changed
- Improved the visual format of the output, ensuring better readability with clearer key-value color distinctions.
- Refined the regex for identifying and removing print statements, ensuring more consistent removal across different print formats.

### Removed
- Deprecated the "Print All Variables" feature for clarity and reduced clutter in the functionality.

## [0.2.4] - 9/16/2024, 2:37:14 PM
### Added
- Initial release of "python-colorful-print" extension, offering customizable colored print output for Python.
