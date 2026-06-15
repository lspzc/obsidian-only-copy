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

# Plug-in: Inline Code Copy Documentation

## 1 What is it?

An Obsidian plugin
Plugin name: lspzc x only copy

What the plugin does: Copy inline code with a single click (reading view) or double click (live preview).

## 2 Why

Inline code syntax

```md
` `
```

There are a lot of situations where you need to use inline code, such as some class names, some very small code snippets, some special text that conflicts with md syntax, or even some text that you want to copy at a later time, **but Obsidian strangely has code block copying, but not inline code copying**.

## 3 How it works

### 3.1 Plugin environment

Plugin development test environment: Windows 11, Obsidian version 1.8.10

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

#### Enable Reading View Copy

Enabled by default. When enabled, click inline code in reading view to copy its content.

#### Enable Live Preview Copy

Enabled by default. When enabled, double-click inline code in editing mode to copy its content.

#### Show Copied Text in Bubble

Enabled by default. After a successful copy, a bubble notification will appear above the inline code. The bubble style follows Google Material Design and automatically adapts to Obsidian's light/dark mode:

- Light mode: light background + dark text
- Dark mode: dark background + light text

When the inline code content is too long, the excess part in the bubble will be replaced with an ellipsis.

#### Bubble Duration and Feedback Effect Duration

Duration is up to your preference

Feedback effect time: only in reading view (because double clicking on Obsidian in edit mode gives you the selected style)
