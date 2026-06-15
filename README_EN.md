<p align="center">
  <img alt="GitHub Repo Stars" src="https://img.shields.io/github/stars/lspzc/obsidian-inlineCode-copy">
  <img alt="GitHub Repo Forks" src="https://img.shields.io/github/forks/lspzc/obsidian-inlineCode-copy">
</p>

<p align="center">
  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/lspzc/obsidian-inlineCode-copy">
  <img alt="GitHub Downloads (all assets, all releases)" src="https://img.shields.io/github/downloads/lspzc/obsidian-inlineCode-copy/total">
  <img alt="GitHub Repo License" src="https://img.shields.io/github/license/lspzc/obsidian-inlineCode-copy">
  <img alt="GitHub Repo Issues" src="https://img.shields.io/github/issues/lspzc/obsidian-inlineCode-copy">
</p>

<p align="center">
  <a href="https://github.com/lspzc/obsidian-inlineCode-copy/releases">Download</a> |
  English |
  <a href="./README.md">中文</a>
</p>

# Plug-in: lspzc x only copy Documentation

## 1 What is it?

An Obsidian text copy plugin
Plugin name: lspzc x only copy

What the plugin does: Quickly copy Markdown formatted text content with a single click (reading view) or double click (live preview). Currently supports inline code and bold text, with more text types to be added in the future.

## 2 Why

Obsidian only provides a copy button for code blocks natively, but there are many other Markdown text formats that need quick copying:

- Inline code `` ` ` ``: class names, commands, small code snippets
- Bold text `** **`: keywords, important content

**These formatted text contents often need to be copied frequently, yet lack a convenient way to do so.** This plugin aims to solve this problem, making any formatted text copyable with a single click.

## 3 How it works

### 3.1 Plugin environment

Plugin development test environment: Windows 11, Obsidian version latest version

Since I don't have a Mac device, I didn't test it. **I suggest you find a test library and try it first**.

Mobile not tested

### 3.2 Downloading Plugins

Currently, the plugin is not yet on the plugin market, so you need to download the plugin by yourself.

GitHub address: [lspzc/obsidian-inlineCode-copy](https://github.com/lspzc/obsidian-inlineCode-copy)

Gitee address: [lspzc/obsidian-share](https://gitee.com/lspzc/obsidain-share)

### 3.3 Installing Plugins

Without going into too much detail here

### 3.4 Plugin Settings

#### Language

Support one-click switching between Chinese and English in the settings interface, default is Chinese

#### Inline Code

- **Enable Reading View Copy**: Enabled by default. When enabled, click inline code in reading view to copy its content.
- **Enable Live Preview Copy**: Enabled by default. When enabled, double-click inline code in editing mode to copy its content.

#### Bold Text

- **Enable Reading View Copy**: Disabled by default. When enabled, click bold text in reading view to copy its content.
- **Enable Live Preview Copy**: Disabled by default. When enabled, double-click bold text in editing mode to copy its content.

#### Bubble Notification

- **Show Copied Text in Bubble**: Enabled by default. After a successful copy, a bubble notification will appear above the element. The bubble style follows Google Material Design and automatically adapts to Obsidian's light/dark mode:
  - Light mode: light background + dark text
  - Dark mode: dark background + light text
  - When the content is too long, the excess part in the bubble will be replaced with an ellipsis.
- **Bubble Duration**: How long the bubble notification stays visible.
- **Feedback Duration**: How long the highlight effect lasts after copying in reading view (only applies to reading view, because double clicking in edit mode triggers Obsidian's text selection).

## 4 Roadmap

This plugin is positioned as a general text copy plugin. Future plans include supporting more Markdown text types such as italic, strikethrough, highlight, links, etc. If you have other needs, feel free to open an Issue.
