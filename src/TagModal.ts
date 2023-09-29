import { App, Modal, TAbstractFile, TFolder } from "obsidian";

export class TagModal extends Modal {
	default: string = "";
	base: TFolder | TAbstractFile[];
	option: string = "inline";
	submission: (obj: any, string: string, setting: string) => void;

	constructor(
		app: App,
		base: TFolder | TAbstractFile[],
		option: string = "inline",
		submission: (obj: any, string: string, setting: string) => void
	) {
		super(app);

		//Removes potential spaces in file names.
		if (base instanceof TFolder) {
			this.default = `${base.name.replace(" ", "-")}`;
		}

		this.base = base;
		this.submission = submission;
		this.option = option;
	}

	onSubmit(e: Event, input: string, option: string): void {
		e.preventDefault();

		//Trim any spaces to prevent splits in tags.
		const trimmed = input.replace(/ /g, "");

		this.submission(this.base, trimmed, option);
		this.close();
	}

	onOpen(): void {
		this.modalEl.addClass("modal");

		const { contentEl, titleEl } = this;

		//Create text.
		titleEl.createEl("h2", { text: "Please type in a tag." });
		contentEl.createEl("span", {
			text: "If you add multiple tags, separate them with commas. Do not add '#'.",
		});

		//Create form object.
		contentEl.createEl("form", { cls: "modal-form" }, (formEl) => {
			//Select object to let user toggle between inline and YAML.
			let selectEl = formEl.createEl("select", { cls: "select" });
			selectEl.createEl("option", {
				value: "inline",
				text: "Inline",
				attr: { selected: this.option === "inline" ? "selected" : null },
			});
			selectEl.createEl("option", {
				value: "yaml",
				text: "YAML",
				attr: { selected: this.option === "yaml" ? "selected" : null },
			});

			let inputEl = formEl.createEl("input", {
				value: this.default,
				attr: { id: "tagInput" },
			});
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

			formEl.addEventListener("submit", (e) =>
				this.onSubmit(e, inputEl.value, selectEl.value)
			);

			//Set focus on the input after the DOM has been updated.
			setTimeout(() => inputEl.focus(), 0);
		});
	}
}
