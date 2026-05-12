## ADDED Requirements

### Requirement: Print button visibility

The system SHALL display a print button in the page header only when analysis results are present.

#### Scenario: Results available
- **WHEN** analysis results are displayed (single or batch mode)
- **THEN** a print button is visible in the header alongside the clear button

#### Scenario: No results
- **WHEN** no analysis results are present (empty state)
- **THEN** the print button is not visible

### Requirement: Trigger browser print

The system SHALL invoke `window.print()` when the user clicks the print button.

#### Scenario: Print dialog opens
- **WHEN** the user clicks the print button
- **THEN** the browser's native print dialog opens

### Requirement: Print-only content visibility

The system SHALL apply `@media print` CSS rules to show only analysis results and hide all interactive elements.

#### Scenario: Interactive elements hidden in print
- **WHEN** the browser renders the page for printing
- **THEN** the JSON input area, chat panel, buttons, and empty state are hidden

#### Scenario: Results visible in print
- **WHEN** the browser renders the page for printing
- **THEN** the abnormality summary, indicator detail table, and header are visible

### Requirement: Print layout quality

The system SHALL apply print-optimized typography including page margins, font sizes, and prevent table rows from breaking across pages.

#### Scenario: Table rows preserved
- **WHEN** a result table spans across page boundaries
- **THEN** individual table rows are not split across pages

#### Scenario: Page header present
- **WHEN** the page is printed or saved as PDF
- **THEN** the report title and generation timestamp appear at the top of each page
