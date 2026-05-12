## ADDED Requirements

### Requirement: Rule engine compares indicators against 2023 reference ranges
The system SHALL compare each blood indicator value against the 2023 Chinese adult blood test reference ranges and assign a severity level.

#### Scenario: Normal value within range
- **WHEN** WBC value is 6.5 and reference range is 3.5-9.5
- **THEN** level is `normal` with green indicator

#### Scenario: Mildly elevated value
- **WHEN** WBC value is 12.0 and reference range is 3.5-9.5 (within 1.5x upper bound)
- **THEN** level is `high` with yellow indicator

#### Scenario: Critically elevated value
- **WHEN** WBC value is 30.0 and reference range is 3.5-9.5 (exceeds 1.5x upper bound)
- **THEN** level is `critical` with red indicator

#### Scenario: Low value
- **WHEN** HGB value is 90 and reference range is 120-160
- **THEN** level is `low` with blue indicator

#### Scenario: Critically low value
- **WHEN** HGB value is 50 and reference range is 120-160 (below 0.5x lower bound)
- **THEN** level is `critical` with red indicator

### Requirement: Gender and age adjustment for reference ranges
The system SHALL adjust reference ranges based on patient gender and age when provided.

#### Scenario: Male HGB uses male reference
- **WHEN** patient gender is male and HGB is 125
- **THEN** reference range uses male range (130-175) and flags as `low`

#### Scenario: Female HGB uses female reference
- **WHEN** patient gender is female and HGB is 125
- **THEN** reference range uses female range (115-150) and flags as `normal`

### Requirement: Interpretation text for each indicator
The system SHALL provide clinical interpretation text for each abnormal indicator based on its code and level.

#### Scenario: Elevated WBC gets infection reminder
- **WHEN** WBC level is `high`
- **THEN** interpretation text includes "白细胞升高常见于细菌感染、炎症、组织损伤"

#### Scenario: Normal indicator has no warning text
- **WHEN** indicator level is `normal`
- **THEN** interpretation text is empty or "正常"

### Requirement: Analysis result summary
The system SHALL produce a summary with counts of normal, abnormal, and critical indicators.

#### Scenario: Mixed results summary
- **WHEN** report has 18 normal, 4 abnormal (2 high, 1 low, 1 critical)
- **THEN** summary shows total=22, normal=18, abnormal=4, criticalCount=1

### Requirement: Critical value prioritization
The system SHALL list critical-value indicators first in the abnormal summary, sorted by severity.

#### Scenario: Critical items shown first
- **WHEN** report has 1 critical and 3 high indicators
- **THEN** the critical indicator appears before high indicators in summary display
