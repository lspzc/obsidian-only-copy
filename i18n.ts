// 多语言包定义
interface I18nContent {
	/** 复制成功提示（含文本），参数为被复制的文本 */
	copied: (text: string) => string;
	/** 复制成功提示（不含文本） */
	copySuccess: string;
	/** 复制失败提示 */
	copyFailed: string;
	/** 设置页标题 */
	settingsTitle: string;
	/** 语言设置项名称 */
	language: string;
	/** 语言设置项描述 */
	languageDesc: string;
	/** 启用阅读视图复制设置项名称 */
	enableReadingView: string;
	/** 启用阅读视图复制设置项描述 */
	enableReadingViewDesc: string;
	/** 启用实时预览设置项名称 */
	enableLivePreview: string;
	/** 启用实时预览设置项描述 */
	enableLivePreviewDesc: string;
	/** 是否显示复制文本设置项名称 */
	showBubbleText: string;
	/** 是否显示复制文本设置项描述 */
	showBubbleTextDesc: string;
	/** 气泡显示时间设置项名称 */
	bubbleDuration: string;
	/** 气泡显示时间设置项描述 */
	bubbleDurationDesc: string;
	/** 反馈效果时间设置项名称 */
	feedbackDuration: string;
	/** 反馈效果时间设置项描述 */
	feedbackDurationDesc: string;
}

export interface I18n {
	en: I18nContent;
	zh: I18nContent;
}

// 多语言包
export const i18n: I18n = {
	en: {
		copied: (text: string) => `Copied: ${text}`,
		copySuccess: "Copy Success!",
		copyFailed: "Copy Failed!",
		settingsTitle: "lspzc x only copy Settings",
		language: "Language",
		languageDesc: "Select display language for the settings interface",
		enableReadingView: "Inline Code Enable Reading View Copy",
		enableReadingViewDesc:
			"When enabled, click inline code in reading view to copy its content",
		enableLivePreview: "Inline Code Enable Live Preview Copy",
		enableLivePreviewDesc:
			"When enabled, double-click inline code in editing mode to copy its content",
		showBubbleText: "Show Copied Text in Bubble",
		showBubbleTextDesc:
			"When enabled, the copied text is displayed in the bubble notification",
		bubbleDuration: "Bubble Duration (ms)",
		bubbleDurationDesc: "How long the bubble notification stays visible",
		feedbackDuration: "Feedback Duration (ms)",
		feedbackDurationDesc:
			"When enabled, the highlight effect lasts after copying inline code in reading view",
	},
	zh: {
		copied: (text: string) => `已复制: ${text}`,
		copySuccess: "复制成功！",
		copyFailed: "复制失败！",
		settingsTitle: "lspzc x only copy 设置",
		language: "语言",
		languageDesc: "选择设置界面的显示语言",
		enableReadingView: "行内代码启用阅读视图复制",
		enableReadingViewDesc:
			"启用后，在阅读视图中单击行内代码即可复制其内容",
		enableLivePreview: "行内代码启用实时预览复制",
		enableLivePreviewDesc:
			"启用后，在编辑模式下双击行内代码即可复制其内容",
		showBubbleText: "气泡显示复制文本",
		showBubbleTextDesc: "启用后，气泡提示中会显示被复制的文本内容",
		bubbleDuration: "气泡显示时间(毫秒)",
		bubbleDurationDesc: "气泡提示持续显示的时间",
		feedbackDuration: "反馈效果时间(毫秒)",
		feedbackDurationDesc: "阅读视图中复制成功时高亮效果的持续时间",
	},
};
