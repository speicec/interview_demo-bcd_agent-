## ADDED Requirements

### Requirement: JSON Schema definition for blood report
The system SHALL define a JSON Schema that validates blood report data structure, including report metadata, patient info, and indicator array.

#### Scenario: Valid report passes validation
- **WHEN** user pastes a JSON object containing required fields (reportId, indicators array with items having code/value/unit)
- **THEN** validation returns success with no errors

#### Scenario: Missing required field fails validation
- **WHEN** user pastes a JSON object missing the required `indicators` field
- **THEN** validation returns failure with error message pointing to missing field

#### Scenario: Invalid indicator code format fails
- **WHEN** user pastes a JSON where an indicator has `code: "123"` (doesn't match `^[A-Z][A-Z0-9]{1,5}$`)
- **THEN** validation returns failure with error message indicating invalid code format

#### Scenario: Invalid value type fails
- **WHEN** user pastes a JSON where an indicator has `value: "high"` (string instead of number)
- **THEN** validation returns failure with error message indicating type mismatch

### Requirement: Frontend-local validation with ajv
The system SHALL perform JSON Schema validation entirely in the browser using ajv, with zero network requests.

#### Scenario: Validation completes within 100ms
- **WHEN** user pastes a valid 50-indicator report
- **THEN** validation result is returned in under 100 milliseconds

### Requirement: User-friendly error display
The system SHALL display validation errors with specific field paths and human-readable messages.

#### Scenario: Multiple errors shown together
- **WHEN** user pastes JSON with 3 validation errors
- **THEN** all 3 errors are displayed with their JSON paths and fix suggestions

#### Scenario: Error display uses red accent
- **WHEN** validation fails
- **THEN** error area renders with red border and red-highlighted text
