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
	/** 行内代码设置分区标题 */
	inlineCodeSection: string;
	/** 行内代码启用阅读视图复制设置项名称 */
	enableInlineCodeReadingView: string;
	/** 行内代码启用阅读视图复制设置项描述 */
	enableInlineCodeReadingViewDesc: string;
	/** 行内代码启用实时预览复制设置项名称 */
	enableInlineCodeLivePreview: string;
	/** 行内代码启用实时预览复制设置项描述 */
	enableInlineCodeLivePreviewDesc: string;
	/** 加粗文本设置分区标题 */
	boldSection: string;
	/** 加粗文本启用阅读视图复制设置项名称 */
	enableBoldReadingView: string;
	/** 加粗文本启用阅读视图复制设置项描述 */
	enableBoldReadingViewDesc: string;
	/** 加粗文本启用实时预览复制设置项名称 */
	enableBoldLivePreview: string;
	/** 加粗文本启用实时预览复制设置项描述 */
	enableBoldLivePreviewDesc: string;
	/** 气泡提示设置分区标题 */
	bubbleSection: string;
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
		inlineCodeSection: "Inline Code",
		enableInlineCodeReadingView: "Enable Reading View Copy",
		enableInlineCodeReadingViewDesc:
			"When enabled, click inline code in reading view to copy its content",
		enableInlineCodeLivePreview: "Enable Live Preview Copy",
		enableInlineCodeLivePreviewDesc:
			"When enabled, double-click inline code in editing mode to copy its content",
		boldSection: "Bold Text",
		enableBoldReadingView: "Enable Reading View Copy",
		enableBoldReadingViewDesc:
			"When enabled, click bold text in reading view to copy its content",
		enableBoldLivePreview: "Enable Live Preview Copy",
		enableBoldLivePreviewDesc:
			"When enabled, double-click bold text in editing mode to copy its content",
		bubbleSection: "Bubble Notification",
		showBubbleText: "Show Copied Text in Bubble",
		showBubbleTextDesc:
			"When enabled, the copied text is displayed in the bubble notification",
		bubbleDuration: "Bubble Duration (ms)",
		bubbleDurationDesc: "How long the bubble notification stays visible",
		feedbackDuration: "Feedback Duration (ms)",
		feedbackDurationDesc:
			"How long the highlight effect lasts after copying in reading view",
	},
	zh: {
		copied: (text: string) => `已复制: ${text}`,
		copySuccess: "复制成功！",
		copyFailed: "复制失败！",
		settingsTitle: "lspzc x only copy 设置",
		language: "语言",
		languageDesc: "选择设置界面的显示语言",
		inlineCodeSection: "行内代码",
		enableInlineCodeReadingView: "启用阅读视图复制",
		enableInlineCodeReadingViewDesc:
			"启用后，在阅读视图中单击行内代码即可复制其内容",
		enableInlineCodeLivePreview: "启用实时预览复制",
		enableInlineCodeLivePreviewDesc:
			"启用后，在编辑模式下双击行内代码即可复制其内容",
		boldSection: "加粗文本",
		enableBoldReadingView: "启用阅读视图复制",
		enableBoldReadingViewDesc:
			"启用后，在阅读视图中单击加粗文本即可复制其内容",
		enableBoldLivePreview: "启用实时预览复制",
		enableBoldLivePreviewDesc:
			"启用后，在编辑模式下双击加粗文本即可复制其内容",
		bubbleSection: "气泡提示",
		showBubbleText: "气泡显示复制文本",
		showBubbleTextDesc: "启用后，气泡提示中会显示被复制的文本内容",
		bubbleDuration: "气泡显示时间(毫秒)",
		bubbleDurationDesc: "气泡提示持续显示的时间",
		feedbackDuration: "反馈效果时间(毫秒)",
		feedbackDurationDesc: "阅读视图中复制成功时高亮效果的持续时间",
	},
};
