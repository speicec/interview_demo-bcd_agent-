## ADDED Requirements

### Requirement: Color system
The system SHALL use a medical-grade color palette with white background, blue as primary, and green as safe/normal indicator.

#### Scenario: Primary actions use blue
- **WHEN** rendering primary buttons and headers
- **THEN** blue (#2563EB or equivalent) is used as the dominant color

#### Scenario: Normal indicators use green
- **WHEN** displaying indicators with `normal` level
- **THEN** green accent (#16A34A) is used for the status badge

#### Scenario: Background is white
- **WHEN** viewing any page
- **THEN** the main background is white (#FFFFFF)

### Requirement: Indicator severity color coding
The system SHALL consistently color-code indicator levels across all components.

#### Scenario: Color mapping consistency
- **WHEN** an indicator has level `normal`
- **THEN** it displays in green (#16A34A)
- **WHEN** an indicator has level `high`
- **THEN** it displays in amber (#F59E0B)
- **WHEN** an indicator has level `critical`
- **THEN** it displays in red (#DC2626)
- **WHEN** an indicator has level `low`
- **THEN** it displays in blue (#2563EB)

### Requirement: Responsive layout
The system SHALL adapt layout for desktop (primary target) and tablet screens.

#### Scenario: Desktop two-column layout
- **WHEN** viewport width is ≥1024px
- **THEN** indicator table and chat panel display side by side

#### Scenario: Tablet stacked layout
- **WHEN** viewport width is between 768px and 1023px
- **THEN** chat panel stacks below the indicator table

### Requirement: Medical disclaimer display
The system SHALL display a persistent medical disclaimer on all pages.

#### Scenario: Disclaimer visible on analysis page
- **WHEN** user views analysis results
- **THEN** a disclaimer reads "本工具仅供健康参考，不构成医疗诊断。如有异常指标请咨询专业医生。"

### Requirement: Accessibility
The system SHALL meet basic accessibility standards for medical use.

#### Scenario: Sufficient color contrast
- **WHEN** text is displayed on colored backgrounds
- **THEN** contrast ratio meets WCAG AA minimum (4.5:1 for normal text)
