import {
	App,
	Modal,
	Plugin,
	PluginSettingTab,
	Setting,
	TAbstractFile,
	TFile,
	TFolder,
} from "obsidian";

interface MultiTagSettings {
	yamlOrInline: string;
}

const DEFAULT_SETTINGS: MultiTagSettings = {
	yamlOrInline: "inline",
};

class TagSettingTab extends PluginSettingTab {
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

export default class MultiTagPlugin extends Plugin {
	settings: MultiTagSettings;
	//Set as Events to unload when needed.
	//Currently have all functions in this class for easy "this" use.  Should it be refactored later?
	async onload() {
		await this.loadSettings();
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file, source) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setIcon("tag")
							.setTitle("Tag folder's files")
							.onClick(() =>
								new TagModal(this.app, file, (obj, string) => {
									this.searchThroughFolders(obj, string);
								}).open()
							);
					});
				}
			})
		);
		this.registerEvent(
			this.app.workspace.on("files-menu", (menu, file, source) => {
				menu.addItem((item) => {
					item
						.setIcon("tag")
						.setTitle("Tag selected files")
						.onClick(() =>
							new TagModal(this.app, file, (obj, string) => {
								this.FilesOrFolders(obj, string);
							}).open()
						);
				});
			})
		);
		this.addSettingTab(new TagSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/** Get all files belonging to a folder and print their file names. */
	searchThroughFolders(obj: TFolder, string: string) {
		for (let child of obj.children) {
			if (child instanceof TFolder) {
				this.searchThroughFolders(child, string);
			}
			if (child instanceof TFile && child.extension === "md") {
				if (this.settings.yamlOrInline === "inline") {
					this.appendToFile(child, string);
				} else {
					this.addToFrontMatter(child, string);
				}
			}
		}
	}

	appendToFile(file: TFile, string: string) {
		this.app.vault.append(file, `\n#${string}`);
	}

	addToFrontMatter(file: TFile, string: string) {
		const tags = string.split(",");
		this.app.fileManager.processFrontMatter(file, (fm: any) => {
			if (!fm.tags) {
				fm.tags = new Set(tags);
			} else {
				fm.tags = new Set([...fm.tags, ...tags]);
			}
		});
	}

	FilesOrFolders(arr: (TFile | TFolder)[], string: string) {
		for (let el of arr) {
			if (el instanceof TFile && el.extension === "md") {
				if (this.settings.yamlOrInline === "inline") {
					this.appendToFile(el, string);
				} else {
					this.addToFrontMatter(el, string);
				}
			}
		}
	}
}

class TagModal extends Modal {
	default: string = "";
	base: TFolder | TAbstractFile[];
	submission: (obj: any, string: string) => void;

	constructor(
		app: App,
		base: TFolder | TAbstractFile[],
		submission: (obj: any, string: string) => void
	) {
		super(app);

		//Removes potential spaces in file names.  Should I also remove capitalization?
		if (base instanceof TFolder) {
			this.default = `${base.name.replace(" ", "-")}`;
		}

		this.base = base;
		this.submission = submission;
	}

	onSubmit(e: Event, input: string) {
		e.preventDefault();

		//Run code for adding text to all files.
		this.submission(this.base, input);
		this.close();
	}

	onOpen(): void {
		this.modalEl.addClass("modal");

		const { contentEl, titleEl } = this;

		//Create text.
		titleEl.createEl("h2", { text: "Please type in a tag." });
		contentEl.createEl("span", {
			text: "If you add multiple tags, separate them with commas. Do not add '#'",
		});

		//Create form object.
		contentEl.createEl("form", { cls: "modal-form" }, (formEl) => {
			let input = formEl.createEl("input", { value: this.default });

			formEl.createDiv("modal-button-container", (buttonEl) => {
				let btnSubmit = buttonEl.createEl("button", {
					text: "Submit",
					type: "submit",
					cls: "mod-cta",
				});

				let btnCancel = buttonEl.createEl("button", {
					text: "Cancel",
					type: "cancel",
				});
				btnCancel.addEventListener("click", () => this.close());
			});

			formEl.addEventListener("submit", (e) => this.onSubmit(e, input.value));
		});
	}
}
