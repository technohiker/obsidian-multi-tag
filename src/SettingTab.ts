import { PluginSettingTab, App, Setting } from "obsidian";

import MultiTagPlugin from "./main";

export class SettingTab extends PluginSettingTab {
	plugin: MultiTagPlugin;

	constructor(app: App, plugin: MultiTagPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		let { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("YAML or Inline")
			.setDesc("Choose whether to use YAML or inline tags.")
			.addDropdown((dropdown) => {
				dropdown.addOption("inline", "Inline");
				dropdown.addOption("yaml", "YAML");
				dropdown.setValue(this.plugin.settings.yamlOrInline);
				dropdown.onChange(async (value) => {
					this.plugin.settings.yamlOrInline = value;
					await this.plugin.saveSettings();
				});
			});
	}
}

export interface MultiTagSettings {
	yamlOrInline: string;
}
