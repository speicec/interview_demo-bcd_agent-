## ADDED Requirements

### Requirement: Chat session per conversation
The system SHALL create and manage a dedicated pi agent session for each chat conversation, identified by chatId.

#### Scenario: New chat creates new session
- **WHEN** user starts a new conversation with a fresh chatId
- **THEN** a new pi AgentSession is created with the medical system prompt and custom tools

#### Scenario: Returning chat resumes session
- **WHEN** user sends a message with an existing chatId
- **THEN** the existing pi AgentSession is reused with preserved conversation history

### Requirement: Medical system prompt
The system SHALL configure the pi agent with a medical system prompt that constrains the LLM to use rule engine results as authoritative source.

#### Scenario: LLM references rule engine results
- **WHEN** user asks "WBC为什么高"
- **THEN** the LLM references the current report's rule engine analysis in its response, not fabricating reference ranges

#### Scenario: LLM includes medical disclaimer
- **WHEN** LLM generates any response
- **THEN** response includes disclaimer text "本回复仅供健康参考，不构成医疗诊断建议。如有不适请及时就医。"

### Requirement: Streaming SSE chat endpoint
The system SHALL stream LLM responses to the frontend via Server-Sent Events (SSE) using pi session subscription events.

#### Scenario: Text delta streamed to frontend
- **WHEN** LLM generates response text token by token
- **THEN** each token is sent as an SSE `text_delta` event to the frontend

#### Scenario: Turn completion event
- **WHEN** LLM finishes a complete response turn
- **THEN** an SSE `turn_end` event is sent, signaling the frontend to stop the loading indicator

### Requirement: Custom tools for medical analysis
The system SHALL register custom pi tools (`analyze_blood_report`, `get_reference_range`) that the LLM can invoke.

#### Scenario: LLM calls analyze tool
- **WHEN** user asks about their blood report results
- **THEN** the LLM may call `analyze_blood_report` tool with the current report JSON to get authoritative analysis before responding

#### Scenario: LLM queries reference range
- **WHEN** user asks "PLT的正常范围是多少"
- **THEN** the LLM calls `get_reference_range` tool with code "PLT" instead of guessing

### Requirement: DeepSeek provider configuration
The system SHALL configure DeepSeek v4 Flash as the model provider via pi's OpenAI-compatible provider registration.

#### Scenario: API key from environment variable
- **WHEN** server starts with DEEPSEEK_API_KEY environment variable set
- **THEN** pi model registry has deepseek-v4-flash available for chat sessions

#### Scenario: Missing API key graceful degradation
- **WHEN** DEEPSEEK_API_KEY is not set
- **THEN** chat endpoint returns 503 with message "AI对话服务暂未配置" and the analysis (rule engine) endpoints continue to work

### Requirement: Session pool with TTL
The system SHALL maintain a pool of chat sessions with 30-minute TTL and automatic cleanup.

#### Scenario: Expired session cleaned up
- **WHEN** a chat session has been idle for over 30 minutes
- **THEN** the session is removed from the pool and its resources are freed

#### Scenario: Maximum pool size enforced
- **WHEN** session pool reaches 100 active sessions
- **THEN** the oldest idle session is evicted before creating a new one
