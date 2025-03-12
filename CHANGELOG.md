# Changelog

## [Unreleased]

### Added
- Inline editing capabilities for business plans
  - Created a reusable `InlineEdit` component for subtle text editing
  - Added ability to edit business plan title, idea, location, category, and section content
  - Implemented auto-save functionality for edited business plans
- Updated business plan title format to use "[business idea], [location]"
- Added test scripts to verify business plan saving and editing functionality

### Fixed
- Fixed issues with business plan saving to database
  - Corrected schema mismatches
  - Improved error handling with specific error messages
  - Added fallback to local storage when database saving fails

## [1.0.0] - 2023-03-01

### Added
- Initial release 