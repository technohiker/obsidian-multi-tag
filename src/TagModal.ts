import { App, Modal, TAbstractFile, TFolder } from "obsidian";
import TagForm from "./TagForm.svelte";

export class TagModal extends Modal {
	default: string = "";
	base: TFolder | TAbstractFile[];
	option: string = "inline";
	submission: (obj: any, string: string, setting: string) => void;
	component: TagForm;

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

	async onOpen() {
		this.titleEl.createEl("h2", { text: "Please type in a tag." });

		this.component = new TagForm({
			target: this.contentEl,
			props: {
				value: this.default,
				option: this.option,
				closeModal: () => this.close(),
				submission: this.onSubmit,
			},
		});
	}

	onSubmit(input: string, option: string): void {
		//Trim any spaces to prevent splits in tags.
		const trimmed = input.replace(/ /g, "");

		this.submission(this.base, trimmed, option);
		this.close();
	}
}
