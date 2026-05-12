## ADDED Requirements

### Requirement: Bacterial infection pattern detection
The system SHALL detect the combination of elevated WBC and elevated NEUT and flag as bacterial infection pattern.

#### Scenario: WBC and NEUT both elevated
- **WHEN** WBC level is `high` and NEUT level is `high`
- **THEN** system generates alert "白细胞+中性粒细胞同时升高，符合细菌性感染典型表现" with severity `warn`

#### Scenario: Only WBC elevated
- **WHEN** WBC level is `high` but NEUT is `normal`
- **THEN** no bacterial infection pattern alert is generated

### Requirement: Anemia type classification
The system SHALL classify anemia type based on HGB, MCV, and MCH combination.

#### Scenario: Microcytic hypochromic anemia
- **WHEN** HGB is `low`, MCV is `low`, and MCH is `low`
- **THEN** system generates alert "小细胞低色素性贫血，常见于缺铁性贫血、地中海贫血"

#### Scenario: Normocytic anemia
- **WHEN** HGB is `low`, MCV is `normal`
- **THEN** system generates alert indicating normocytic anemia with possible causes

### Requirement: Pancytopenia alert
The system SHALL detect concurrent reduction of all three blood cell lineages (WBC, HGB, PLT) as a critical alert.

#### Scenario: All three lineages reduced
- **WHEN** WBC, HGB, and PLT are all `low` or `critical`
- **THEN** system generates critical alert "全血细胞减少(三系减少)，需警惕骨髓抑制、再生障碍性贫血"

### Requirement: Correlation alerts included in analysis response
The system SHALL include all triggered correlation alerts in the analysis API response under a dedicated `alerts` field.

#### Scenario: Multiple correlation alerts triggered
- **WHEN** a report triggers both infection pattern and anemia classification
- **THEN** response contains both alerts in `alerts` array, each with `severity`, `title`, `description`, and `relatedIndicators` fields
