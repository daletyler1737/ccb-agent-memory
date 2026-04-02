---
name: ccb-agent-memory
description: |
  Agent memory snapshot system inspired by Claude Code Best's agentMemorySnapshot.ts.
  Captures agent conversation context, tool results, and decisions as snapshots for resume.
  Use when: resuming a long task, reviewing agent decisions, or debugging agent behavior.
  Triggers: "save snapshot", "resume from snapshot", "memory snapshot", "agent history".
---

# Agent Memory Snapshot

Persists agent state for later resume and debugging.

## Snapshot Contents

```
snapshot_20260402_001/
  meta.json        # Agent info, model, timestamp
  messages.json    # Conversation history
  tools.json       # Tool results
  decisions.json   # Key decisions made
  files.json       # Files created/modified
```

## Usage

```bash
# Save current session snapshot
node snapshot.ts save "User requested feature X"

# List snapshots
node list.ts

# Resume from snapshot
node resume.ts <snapshot-id>

# Diff two snapshots
node diff.ts <id1> <id2>
```

## Use Cases

- **Resume**: Restore agent to previous state after interruption
- **Audit**: Review what agent decided and why
- **Debug**: Compare snapshots to understand behavior changes
- **Context**: Load snapshot context into new session
