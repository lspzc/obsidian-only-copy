<p align="center">
  <img alt="GitHub Repo Stars" src="https://img.shields.io/github/stars/lspzc/obsidian-only-copy">
  <img alt="GitHub Repo Forks" src="https://img.shields.io/github/forks/lspzc/obsidian-only-copy">
</p>

<p align="center">
  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/lspzc/obsidian-only-copy">
  <img alt="GitHub Downloads (all assets, all releases)" src="https://img.shields.io/github/downloads/lspzc/obsidian-only-copy/total">
  <img alt="GitHub Repo License" src="https://img.shields.io/github/license/lspzc/obsidian-only-copy">
  <img alt="GitHub Repo Issues" src="https://img.shields.io/github/issues/lspzc/obsidian-only-copy">
</p>

<p align="center">
  <a href="https://github.com/lspzc/obsidian-only-copy/releases">Download</a> |
  中文 |
  <a href="./README_EN.md">English</a>
</p>

# 插件：lspzc x only copy 说明文档

## 1 是什么

插件名称：lspzc x only copy

> 一个 Obsidian 文本复制插件

插件功能：单击（阅读视图）或双击（实时预览）快速复制 Markdown 格式文本内容，当前支持行内代码和加粗文本，后续将持续拓展更多文本类型。

## 2 为什么

Obsidian 原生只支持代码块的复制按钮，但 Markdown 中还有许多需要快速复制的文本格式：

- 行内代码 `` ` ` ``：类名、命令、小代码片段
- 加粗文本 `** **`：关键词、重要内容

**这些格式化的文本内容往往需要频繁复制，却缺少便捷的复制方式。** 本插件旨在解决这个问题，让格式化的文本能一键复制。

## 3 怎么用

### 3.1 插件环境

插件开发测试环境：Windows 11 系统，Obsidian 版本最新版本

由于本人没有 Mac 设备，所以未作测试，**建议先找一个测试库试一试**

移动端未开发测试

### 3.2 下载插件

目前插件尚未上架插件市场，目前需要自行下载插件

GitHub 地址：[lspzc/obsidian-only-copy](https://github.com/lspzc/obsidian-only-copy)

### 3.3 安装插件

这里不过多介绍，可以参考：[PKMer_Obsidian 社区插件的安装](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6%E7%9A%84%E5%AE%89%E8%A3%85/#%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85) 中的手动安装

### 3.4 插件设置

#### 语言

支持在设置界面一键切换中英文，默认中文

#### 行内代码

- **启用阅读视图复制**：默认启用，启用后在阅读视图中单击行内代码即可复制其内容
- **启用实时预览复制**：默认启用，启用后在编辑模式下双击行内代码即可复制其内容

#### 加粗文本

- **启用阅读视图复制**：默认关闭，启用后在阅读视图中单击加粗文本即可复制其内容
- **启用实时预览复制**：默认关闭，启用后在编辑模式下双击加粗文本即可复制其内容

#### 气泡提示

- **气泡显示复制文本**：默认启用，复制成功后会在元素上方显示气泡提示，气泡样式参考 Google Material Design 风格，自动适配 Obsidian 亮暗模式
  - 亮色模式：浅色背景 + 深色文字
  - 暗色模式：深色背景 + 浅色文字
  - 当内容过长时，气泡中会用省略号代替超出部分
- **气泡显示时间**：气泡提示持续显示的时间
- **反馈效果时间**：阅读视图中复制成功时高亮效果的持续时间（编辑模式下双击 Obsidian 会有选中的样式，因此仅在阅读视图生效）

## 4 后续计划

本插件定位为通用文本复制插件，后续计划支持更多 Markdown 文本类型，如斜体、删除线、高亮、链接等。如果你有其他需求，欢迎提 Issue。
