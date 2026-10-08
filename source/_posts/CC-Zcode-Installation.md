---
title: CC-Installation
date: 2026-10-08 15:34:19
tags:
---

## Claude Code

### 安装准备

[Node.js安装地址](https://nodejs.org/zh-cn/download): Windows 选用 Windows 安装程序（.msi）/ MacOS选用 macOS 安装程序（.pkg）

### 安装验证
#### Windows/MacOS

```shell
npm -v
11.19.0
node -v
v24.21.0
```
### Config配置

#### 编辑.claude.json
windows: 编辑`C:\Users\<用户名>\.claude.json`, 加入字段`hasCompletedOnboarding: true`
mac: 编辑`~/.claude.json`, 加入字段`hasCompletedOnboarding: true`

### 新增settings.json
windows: 新增`C:\Users\<用户名>\.claude\settings.json`并编辑
mac: 新增`~/.claude/settings.json`

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://st8tp3ajl0df3n8b8l8qu.apigateway-cn-beijing.volceapi.com/compatible",
    "ANTHROPIC_AUTH_TOKEN": "",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "ANTHROPIC_MODEL": "glm-5.3",
    "ANTHROPIC_SMALL_FAST_MODEL": "glm-5.3",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5.3",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5.3",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-5.3",
    "CLAUDE_CODE_MAX_CONTEXT_TOKENS": "1000000",
    "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "1000000"
  },
  "permissions": {
    "allow": [
      "Bash(mvn:*)",
      "Bash(git:*)",
      "Bash(java:*)",
      "Bash(javac:*)",
      "Bash(jar:*)",
      "Bash(dir:*)",
      "Bash(ls:*)",
      "Bash(cd:*)",
      "Bash(find:*)",
      "Bash(sed:*)",
      "Bash(mkdir:*)",
      "Bash(echo:*)",
      "Bash(cat:*)",
      "Bash(type:*)",
      "Bash(scp:*)",
      "Bash(ssh-copy-id:*)",
      "Read(**)",
      "Grep",
      "Glob",
      "LS",
      "Edit",
      "NotebookRead",
      "mcp__playwright__browser_click",
      "mcp__playwright__browser_close",
      "mcp__playwright__browser_install",
      "mcp__playwright__browser_navigate",
      "mcp__playwright__browser_snapshot",
      "mcp__playwright__browser_tab_list",
      "mcp__playwright__browser_tab_new",
      "mcp__playwright__browser_take_screenshot",
      "mcp__playwright__browser_type"
    ],
    "deny": [],
    "ask": [
      "Bash(git push:*)",
      "Bash(rm:*)",
      "Bash(del:*)"
    ],
    "defaultMode": "default"
  },
  "skipWebFetchPreflight": true,
  "skipDangerousModePermissionPrompt": true,
  "theme": "dark",
  "tui": "fullscreen"
}
```
其中，ANTHROPIC_AUTH_TOKEN 为授权获得的APIKEY。

### 启动运行

```shell
claude
```
### 切换模型

GLM5.3: `glm-5.3`;

DeepSeek V4 Flash: `deepseek-v4-flash`;

DeepSeek V4 Pro: `deepseek-v4-pro`

