---
name: ccb-agent-memory
description: |
  Agent memory snapshot system / Agent 记忆快照系统
  Inspired by Claude Code Best's agentMemorySnapshot.ts.
  Captures agent conversation context, tool results, and decisions as snapshots for resume.
  Use when: resuming a long task, reviewing agent decisions, or debugging agent behavior.
  用途：保存 Agent 对话上下文、工具结果和决策，供后续恢复使用。
  触发词 / Triggers: "save snapshot", "resume from snapshot", "memory snapshot", "保存快照", "恢复会话"
---

# Agent Memory Snapshot / Agent 记忆快照

Persists agent state for later resume and debugging.
保存 Agent 状态以便后续恢复和调试。

## 功能特点 / Features

- **Snapshot** - 保存当前会话的所有关键信息 / Save all key session info
- **Resume** - 从任意快照恢复 / Restore from any snapshot
- **Diff** - 对比两个快照的差异 / Compare two snapshots
- **Persistent** - 存储在 ~/.openclaw/snapshots/ / Stored in ~/.openclaw/snapshots/

## 快照内容 / Snapshot Contents

```
snapshot_20260402_001/
  meta.json        # Agent info, model, timestamp / Agent信息、模型、时间戳
  messages.json    # Conversation history / 对话历史
  tools.json       # Tool results / 工具结果
  decisions.json   # Key decisions / 关键决策
  files.json       # Files created/modified / 创建/修改的文件
```

## 使用方法 / Usage

```bash
# 保存当前会话快照 / Save current session snapshot
node snapshot.ts save "User requested feature X"

# 列出所有快照 / List all snapshots
node snapshot.ts list

# 从快照恢复 / Resume from snapshot
node snapshot.ts resume <snapshot-id>

# 对比两个快照 / Diff two snapshots
node snapshot.ts diff <id1> <id2>
```

## 应用场景 / Use Cases

- **Resume / 恢复** - Agent被打断后恢复到之前状态 / Restore agent after interruption
- **Audit / 审计** - 审查 Agent 的决策过程 / Review agent decisions
- **Debug / 调试** - 对比快照理解行为变化 / Compare snapshots to understand behavior
- **Context / 上下文** - 将快照上下文加载到新会话 / Load snapshot into new session
