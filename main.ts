import {
	Plugin,
	App,
	Setting,
	PluginSettingTab,
} from "obsidian";
import { i18n } from "./i18n";

/** 气泡中显示的最大字符数，超出部分用省略号代替 */
const BUBBLE_MAX_TEXT_LENGTH = 30;

/** 插件设置项接口 */
interface ClickToCopySettings {
	/** 是否启用阅读视图下行内代码的复制功能 */
	enableInlineCodeReadingView: boolean;
	/** 是否启用实时预览模式下行内代码的复制功能（双击触发） */
	enableInlineCodeLivePreview: boolean;
	/** 是否启用阅读视图下加粗文本的复制功能 */
	enableBoldReadingView: boolean;
	/** 是否启用实时预览模式下加粗文本的复制功能（双击触发） */
	enableBoldLivePreview: boolean;
	/** 气泡中是否显示复制的文本内容 */
	showBubbleText: boolean;
	/** 气泡显示持续时间（毫秒） */
	bubbleDuration: number;
	/** 复制成功后高亮反馈的持续时间（毫秒） */
	feedbackDuration: number;
	/** 界面语言 */
	language: "en" | "zh";
}

/** 默认设置值 */
const DEFAULT_SETTINGS: ClickToCopySettings = {
	enableInlineCodeReadingView: true,
	enableInlineCodeLivePreview: true,
	enableBoldReadingView: false,
	enableBoldLivePreview: false,
	showBubbleText: true,
	bubbleDuration: 1500,
	feedbackDuration: 1500,
	language: "zh",
};

/**
 * lspzc x only copy 插件主类
 * 功能：单击（阅读视图）或双击（实时预览）复制行内代码和加粗文本
 */
export default class ClickToCopyPlugin extends Plugin {
	settings: ClickToCopySettings;
	/** 气泡 DOM 元素引用，复用避免频繁创建 */
	private bubbleEl: HTMLDivElement | null = null;
	/** 气泡自动消失的定时器 ID */
	private bubbleTimeoutId: number | null = null;
	/** 气泡消失动画的定时器 ID */
	private bubbleFadeTimeoutId: number | null = null;
	/** 高亮反馈的定时器 ID 列表 */
	private feedbackTimeoutIds: number[] = [];

	async onload() {
		await this.loadSettings();

		// 注册阅读模式单击事件
		this.registerDomEvent(document, "click", this.handleClick.bind(this));

		// 注册实时预览模式双击事件
		this.registerDomEvent(
			document,
			"dblclick",
			this.handleDoubleClick.bind(this)
		);

		// 添加设置选项卡
		this.addSettingTab(new ClickToCopySettingTab(this.app, this));

		console.log("lspzc x only copy plugin loaded");
	}

	onunload() {
		// 清理气泡 DOM 元素
		this.removeBubble();
		// 清理所有未完成的定时器，防止内存泄漏
		this.clearAllTimers();
		console.log("lspzc x only copy plugin unloaded");
	}

	/**
	 * 处理阅读模式下的单击事件
	 * 根据点击目标判断是行内代码还是加粗文本，分别处理
	 */
	private handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;

		// 处理行内代码点击
		if (this.settings.enableInlineCodeReadingView) {
			const codeElement = target.closest(
				".markdown-reading-view code"
			) as HTMLElement | null;
			if (codeElement && !codeElement.closest("pre")) {
				this.processElement(codeElement, "code");
				return;
			}
		}

		// 处理加粗文本点击
		if (this.settings.enableBoldReadingView) {
			const boldElement = target.closest(
				".markdown-reading-view strong"
			) as HTMLElement | null;
			if (boldElement) {
				this.processElement(boldElement, "bold");
				return;
			}
		}
	}

	/**
	 * 处理实时预览模式下的双击事件
	 * 根据点击目标判断是行内代码还是加粗文本，分别处理
	 */
	private handleDoubleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;

		// 处理行内代码双击
		if (this.settings.enableInlineCodeLivePreview) {
			const codeElement = target.closest(
				".cm-content span.cm-inline-code"
			) as HTMLElement | null;
			if (codeElement) {
				// 查找实际内容元素（排除格式化符号元素）
				const contentElement = this.findContentElement(codeElement, "cm-inline-code");
				if (contentElement) {
					this.processElement(contentElement, "code");
					return;
				}
			}
		}

		// 处理加粗文本双击
		if (this.settings.enableBoldLivePreview) {
			const boldElement = target.closest(
				".cm-content .cm-strong"
			) as HTMLElement | null;
			if (boldElement) {
				// 查找实际内容元素（排除格式化符号元素）
				const contentElement = this.findContentElement(boldElement, "cm-strong");
				if (contentElement) {
					this.processElement(contentElement, "bold");
					return;
				}
			}
		}
	}

	/**
	 * 查找实际内容元素
	 * 在实时预览模式下，Markdown 语法符号（如 `**` 或反引号）和实际文本
	 * 会被分别渲染为独立的 span 元素，格式化符号带有 cm-formatting 类名。
	 * 当用户点击到格式化符号时，需要找到包含实际文本内容的兄弟元素。
	 * @param element - 通过 closest 找到的元素
	 * @param className - 内容元素的类名（cm-inline-code 或 cm-strong）
	 * @returns 包含实际文本内容的元素，若找不到则返回 null
	 */
	private findContentElement(element: HTMLElement, className: string): HTMLElement | null {
		// 如果当前元素不是格式化符号，直接返回
		if (!element.classList.contains("cm-formatting")) {
			return element;
		}

		// 点击到了格式化符号，在其父元素中查找实际内容元素
		const parent = element.parentElement;
		if (!parent) return null;

		// 查找同层级中不带 cm-formatting 类名的目标元素
		const contentElement = parent.querySelector(
			`:scope > .${className}:not(.cm-formatting)`
		) as HTMLElement | null;
		return contentElement;
	}

	/**
	 * 处理元素的复制逻辑
	 * @param element - 被点击的 DOM 元素
	 * @param type - 元素类型："code" 行内代码 或 "bold" 加粗文本
	 */
	private processElement(element: HTMLElement, type: "code" | "bold") {
		// 提取纯文本内容（去除 Markdown 语法符号）
		const content = this.extractContent(element, type);
		if (!content) return; // 内容为空则跳过

		// 执行复制操作
		this.copyToClipboard(content)
			.then((success) => {
				if (success) {
					// 添加视觉反馈（高亮效果）
					element.classList.add("copied");
					const feedbackId = window.setTimeout(() => {
						element.classList.remove("copied");
					}, this.settings.feedbackDuration);
					this.feedbackTimeoutIds.push(feedbackId);

					// 显示气泡提示
					const lang = this.settings.language;
					const bubbleText = this.settings.showBubbleText
						? i18n[lang].copied(this.truncateText(content))
						: i18n[lang].copySuccess;
					this.showBubble(element, bubbleText);
				} else {
					this.showBubble(
						element,
						i18n[this.settings.language].copyFailed
					);
				}
			})
			.catch((err) => {
				console.error("Failed to copy: ", err);
				this.showBubble(
					element,
					i18n[this.settings.language].copyFailed
				);
			});
	}

	/**
	 * 从元素中提取纯文本内容，去除 Markdown 语法符号
	 * 在实时预览模式下，textContent 可能包含语法符号（如 `**text**` 或 `` `text` ``），
	 * 需要将其去除以获取实际文本内容。
	 * @param element - DOM 元素
	 * @param type - 元素类型："code" 行内代码 或 "bold" 加粗文本
	 * @returns 去除语法符号后的纯文本内容
	 */
	private extractContent(element: HTMLElement, type: "code" | "bold"): string {
		let text = element.textContent || "";

		if (type === "code") {
			// 去除反引号包裹（支持单个或多个反引号，如 ``text``）
			text = text.replace(/^`+/, "").replace(/`+$/, "");
		} else if (type === "bold") {
			// 去除加粗标记包裹（** 或 __）
			text = text.replace(/^\*\*|^__/, "").replace(/\*\*$|__$/, "");
		}

		return text;
	}

	/**
	 * 复制文本到剪贴板
	 * 优先使用现代 Clipboard API，失败时降级为 execCommand
	 */
	private async copyToClipboard(text: string): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// 降级方案：使用 document.execCommand('copy')
			const textArea = document.createElement("textarea");
			textArea.value = text;
			textArea.style.position = "fixed";
			textArea.style.opacity = "0";
			document.body.appendChild(textArea);
			textArea.select();
			try {
				const success = document.execCommand("copy");
				document.body.removeChild(textArea);
				return success;
			} catch {
				document.body.removeChild(textArea);
				return false;
			}
		}
	}

	/**
	 * 截断过长文本
	 * 超出最大长度的部分用省略号代替
	 */
	private truncateText(text: string): string {
		if (text.length <= BUBBLE_MAX_TEXT_LENGTH) return text;
		return text.slice(0, BUBBLE_MAX_TEXT_LENGTH) + "...";
	}

	/**
	 * 显示气泡提示
	 * 默认显示在元素上方，自动适配 Obsidian 亮暗模式
	 * 气泡样式参考 Google Material Design 风格
	 */
	private showBubble(element: Element, message: string) {
		// 清除之前的气泡定时器
		this.clearBubbleTimers();

		// 获取或创建气泡元素（复用已有元素避免频繁创建销毁）
		if (!this.bubbleEl) {
			this.bubbleEl = document.createElement("div");
			this.bubbleEl.className = "click-to-copy-bubble";
			document.body.appendChild(this.bubbleEl);
		}

		const bubble = this.bubbleEl;

		// 重置状态
		bubble.classList.remove("fade-out");
		bubble.style.display = "block";

		// 设置内容
		bubble.textContent = message;

		// 自动适配亮暗模式：亮色主题用亮色气泡，暗色主题用暗色气泡
		const isDarkMode = document.body.classList.contains("theme-dark");
		bubble.classList.toggle("bubble-dark", isDarkMode);
		bubble.classList.toggle("bubble-light", !isDarkMode);

		// 计算位置（默认在元素上方居中）
		const rect = element.getBoundingClientRect();
		const bubbleRect = bubble.getBoundingClientRect();
		const scrollY = window.scrollY || window.pageYOffset;

		let top = rect.top + scrollY - bubbleRect.height - 8;
		let left = rect.left + rect.width / 2 - bubbleRect.width / 2;

		// 边界检测：确保气泡不超出视口
		if (top < scrollY) top = scrollY + 8;
		if (left < 8) left = 8;
		if (left + bubbleRect.width > window.innerWidth - 8) {
			left = window.innerWidth - bubbleRect.width - 8;
		}

		bubble.style.top = `${top}px`;
		bubble.style.left = `${left}px`;

		// 设置自动消失定时器
		this.bubbleTimeoutId = window.setTimeout(() => {
			bubble.classList.add("fade-out");
			// 消失动画完成后隐藏元素
			this.bubbleFadeTimeoutId = window.setTimeout(() => {
				bubble.style.display = "none";
				this.bubbleTimeoutId = null;
				this.bubbleFadeTimeoutId = null;
			}, 200);
		}, this.settings.bubbleDuration);
	}

	/** 移除气泡 DOM 元素 */
	private removeBubble() {
		if (this.bubbleEl) {
			this.bubbleEl.remove();
			this.bubbleEl = null;
		}
	}

	/** 清理气泡相关的定时器 */
	private clearBubbleTimers() {
		if (this.bubbleTimeoutId !== null) {
			window.clearTimeout(this.bubbleTimeoutId);
			this.bubbleTimeoutId = null;
		}
		if (this.bubbleFadeTimeoutId !== null) {
			window.clearTimeout(this.bubbleFadeTimeoutId);
			this.bubbleFadeTimeoutId = null;
		}
	}

	/** 清理所有定时器，防止插件卸载后回调仍在执行 */
	private clearAllTimers() {
		this.clearBubbleTimers();
		this.feedbackTimeoutIds.forEach((id) => window.clearTimeout(id));
		this.feedbackTimeoutIds = [];
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

/**
 * 插件设置面板
 * 提供语言、行内代码、加粗文本、气泡提示等配置项
 */
class ClickToCopySettingTab extends PluginSettingTab {
	plugin: ClickToCopyPlugin;

	constructor(app: App, plugin: ClickToCopyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const lang = this.plugin.settings.language;
		const t = i18n[lang];

		// ===== 语言设置 =====
		new Setting(containerEl)
			.setName(t.language)
			.setDesc(t.languageDesc)
			.addDropdown((dropdown) =>
				dropdown
					.addOption("zh", "中文")
					.addOption("en", "English")
					.setValue(this.plugin.settings.language)
					.onChange(async (value: "en" | "zh") => {
						this.plugin.settings.language = value;
						await this.plugin.saveSettings();
						// 切换语言后重新渲染设置界面
						this.display();
					})
			);

		// ===== 行内代码设置 =====
		containerEl.createEl("h3", { text: t.inlineCodeSection });

		new Setting(containerEl)
			.setName(t.enableInlineCodeReadingView)
			.setDesc(t.enableInlineCodeReadingViewDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableInlineCodeReadingView)
					.onChange(async (value) => {
						this.plugin.settings.enableInlineCodeReadingView = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t.enableInlineCodeLivePreview)
			.setDesc(t.enableInlineCodeLivePreviewDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableInlineCodeLivePreview)
					.onChange(async (value) => {
						this.plugin.settings.enableInlineCodeLivePreview = value;
						await this.plugin.saveSettings();
					})
			);

		// ===== 加粗文本设置 =====
		containerEl.createEl("h3", { text: t.boldSection });

		new Setting(containerEl)
			.setName(t.enableBoldReadingView)
			.setDesc(t.enableBoldReadingViewDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableBoldReadingView)
					.onChange(async (value) => {
						this.plugin.settings.enableBoldReadingView = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t.enableBoldLivePreview)
			.setDesc(t.enableBoldLivePreviewDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableBoldLivePreview)
					.onChange(async (value) => {
						this.plugin.settings.enableBoldLivePreview = value;
						await this.plugin.saveSettings();
					})
			);

		// ===== 气泡提示设置 =====
		containerEl.createEl("h3", { text: t.bubbleSection });

		new Setting(containerEl)
			.setName(t.showBubbleText)
			.setDesc(t.showBubbleTextDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showBubbleText)
					.onChange(async (value) => {
						this.plugin.settings.showBubbleText = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t.bubbleDuration)
			.setDesc(t.bubbleDurationDesc)
			.addSlider((slider) => {
				slider
					.setLimits(500, 3000, 100)
					.setValue(this.plugin.settings.bubbleDuration)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.bubbleDuration = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(t.feedbackDuration)
			.setDesc(t.feedbackDurationDesc)
			.addSlider((slider) => {
				slider
					.setLimits(500, 3000, 100)
					.setValue(this.plugin.settings.feedbackDuration)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.feedbackDuration = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
