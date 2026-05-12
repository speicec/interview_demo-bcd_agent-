## ADDED Requirements

### Requirement: Batch JSON input as array
The system SHALL accept a JSON array of report objects for batch analysis.

#### Scenario: Batch array accepted
- **WHEN** user pastes a JSON array containing 3 valid report objects
- **THEN** validation passes and all 3 reports are queued for analysis

#### Scenario: Mixed validity in batch
- **WHEN** user pastes a JSON array where 2 reports are valid and 1 has schema errors
- **THEN** validation reports which indices failed and blocks submission until all are valid

### Requirement: Independent analysis per report
The system SHALL run the rule engine independently on each report in a batch, treating each as a standalone analysis.

#### Scenario: Each report analyzed independently
- **WHEN** batch contains 3 reports
- **THEN** each report gets its own AnalysisResult with independent indicator levels and alerts

### Requirement: Tab-based report switching
The system SHALL display each report's results in a separate tab, with the report ID (or index) as the tab label.

#### Scenario: Switch between report tabs
- **WHEN** user clicks on Report 2's tab
- **THEN** the display switches to show Report 2's indicator table and abnormal summary

#### Scenario: Default to first report
- **WHEN** batch analysis completes
- **THEN** the first report's results are displayed by default

### Requirement: Batch overview summary
The system SHALL display an overview row showing key stats for all reports at a glance.

#### Scenario: Overview shows critical counts
- **WHEN** batch of 3 reports completes with report 2 having critical indicators
- **THEN** overview row highlights report 2 with a red badge showing critical count
