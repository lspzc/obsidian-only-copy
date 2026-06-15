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
	/** 是否启用阅读视图下的复制功能 */
	enableReadingView: boolean;
	/** 是否启用实时预览模式下的复制功能（双击触发） */
	enableLivePreview: boolean;
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
	enableReadingView: true,
	enableLivePreview: true,
	showBubbleText: true,
	bubbleDuration: 1500,
	feedbackDuration: 1500,
	language: "zh",
};

/**
 * Inline Code Copy 插件主类
 * 插件名称：lspzc x only copy
 * 功能：单击（阅读视图）或双击（实时预览）复制行内容到剪贴板
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

		// 注册阅读模式点击事件（仅处理行内代码，排除代码块）
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
	 * 处理阅读模式下的点击事件
	 * 仅响应行内代码（code），排除代码块（pre > code）
	 */
	private handleClick(event: MouseEvent) {
		// 检查是否启用阅读视图复制
		if (!this.settings.enableReadingView) return;

		const target = event.target as HTMLElement;

		// 查找被点击的 code 元素
		const codeElement = target.closest(
			".markdown-reading-view code"
		) as HTMLElement | null;
		if (!codeElement) return;

		// 排除代码块：代码块中的 code 被 pre 元素包裹
		if (codeElement.closest("pre")) return;

		this.processCodeElement(codeElement);
	}

	/**
	 * 处理实时预览模式下的双击事件
	 * 仅当启用实时预览时生效，固定使用双击触发
	 */
	private handleDoubleClick(event: MouseEvent) {
		if (!this.settings.enableLivePreview) return;

		const target = event.target as HTMLElement;
		const codeElement = target.closest(
			".cm-content span.cm-inline-code"
		) as HTMLElement | null;
		if (!codeElement) return;

		this.processCodeElement(codeElement);
	}

	/**
	 * 处理代码元素的复制逻辑
	 * 1. 提取代码文本（去除反引号包裹）
	 * 2. 复制到剪贴板
	 * 3. 显示视觉反馈和气泡提示
	 */
	private processCodeElement(codeElement: HTMLElement) {
		// 获取代码文本，去除可能存在的反引号包裹
		const rawText = codeElement.textContent || "";
		let codeContent = rawText;
		if (rawText.startsWith("`") && rawText.endsWith("`")) {
			codeContent = rawText.slice(1, -1);
		}

		// 执行复制操作
		this.copyToClipboard(codeContent)
			.then((success) => {
				if (success) {
					// 添加视觉反馈（高亮效果）
					codeElement.classList.add("copied");
					const feedbackId = window.setTimeout(() => {
						codeElement.classList.remove("copied");
					}, this.settings.feedbackDuration);
					this.feedbackTimeoutIds.push(feedbackId);

					// 显示气泡提示
					const lang = this.settings.language;
					const bubbleText = this.settings.showBubbleText
						? i18n[lang].copied(
							this.truncateText(codeContent)
						)
						: i18n[lang].copySuccess;
					this.showBubble(codeElement, bubbleText);
				} else {
					this.showBubble(
						codeElement,
						i18n[this.settings.language].copyFailed
					);
				}
			})
			.catch((err) => {
				console.error("Failed to copy: ", err);
				this.showBubble(
					codeElement,
					i18n[this.settings.language].copyFailed
				);
			});
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
 * 提供语言、阅读视图、实时预览、气泡提示等配置项
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

		// 语言设置
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

		// 阅读视图复制开关
		new Setting(containerEl)
			.setName(t.enableReadingView)
			.setDesc(t.enableReadingViewDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableReadingView)
					.onChange(async (value) => {
						this.plugin.settings.enableReadingView = value;
						await this.plugin.saveSettings();
					})
			);

		// 实时预览模式开关（固定双击触发）
		new Setting(containerEl)
			.setName(t.enableLivePreview)
			.setDesc(t.enableLivePreviewDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableLivePreview)
					.onChange(async (value) => {
						this.plugin.settings.enableLivePreview = value;
						await this.plugin.saveSettings();
					})
			);

		// 气泡中是否显示复制文本
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

		// 气泡显示时间
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

		// 视觉反馈时间
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
