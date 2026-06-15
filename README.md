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
  中文 |
  <a href="./README_EN.md">English</a>
</p>

# 插件：Inline Code Copy 说明文档

## 1 是什么

插件名称：lspzc x only copy

> 一个 Obsidian 插件

插件功能：单击（阅读视图）或双击（实时预览）复制行内代码

## 2 为什么

行内代码语法

```md
` `
```

很多情况下都需要用到行内代码，比如一些类名，一些很小的代码片段，一些特殊的与 md 语法冲突的文字，甚至是一些后期想要复制的文字，**但 Obsidian 很奇怪，有代码块复制，却没有行内代码复制**。

## 3 怎么用

### 3.1 插件环境

插件开发测试环境：Windows 11 系统，Obsidian 版本 1.8.10

由于本人没有 Mac 设备，所以未作测试，**建议先找一个测试库试一试**

移动端未测试

### 3.2 下载插件

目前插件尚未上架插件市场，目前需要自行下载插件

GitHub 地址：[lspzc/obsidian-inlineCode-copy](https://github.com/lspzc/obsidian-inlineCode-copy)

Gitee 地址：[lspzc/obsidain分享](https://gitee.com/lspzc/obsidain-share)

### 3.3 安装插件

这里不过多介绍，可以参考：[PKMer_Obsidian 社区插件的安装](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6%E7%9A%84%E5%AE%89%E8%A3%85/#%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85) 中的手动安装

### 3.4 插件设置

#### 语言

支持在设置界面一键切换中英文，默认中文

#### 启用阅读视图复制

默认启用，启用后在阅读视图中单击行内代码即可复制其内容

#### 启用实时预览复制

默认启用，启用后在编辑模式下双击行内代码即可复制其内容

#### 气泡显示复制文本

默认启用，复制成功后会在行内代码上方显示气泡提示，气泡样式参考 Google Material Design 风格，自动适配 Obsidian 亮暗模式

- 亮色模式：浅色背景 + 深色文字
- 暗色模式：深色背景 + 浅色文字

当行内代码内容过长时，气泡中会用省略号代替超出部分

#### 气泡显示时间与反馈效果时间

持续时间看大家喜好

反馈效果时间：只在阅览模式下有（因为编辑模式下双击 Obsidian 会有选中的样式）
