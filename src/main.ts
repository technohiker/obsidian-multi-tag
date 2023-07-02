import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  TFolder,
  View,
} from "obsidian";

//Obsidian type definitions don't seem to be up to date, so I'm implementing my own.
interface LeafView extends View {
  file: {
    basename: string;
    deleted: boolean;
    extension: string;
    name: string;
    path: string;
    saving: boolean;
  };
}

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SampleSettingTab(this.app, this));

    //Add menu item that prints all children of folder.
    this.app.workspace.on('file-menu', (menu, file, source) => {
      if (file instanceof TFolder) {
        menu.addItem((item) => {
          item.setIcon('dice').setTitle("Get File Names").onClick(() => this.printFilesInFolder(file))
        })
      }
    })
  }

  onunload() { }

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

  /** Get all files belonging to a folder and print their file names. */
  printFilesInFolder(folder: TFolder) {
    for (let child of folder.children) {
      if (child instanceof TFolder) {
        this.printFilesInFolder(child)
      }
      if (child instanceof TFile && child.extension === "md") {
        console.log("Name:", child.name)
        this.app.vault.append(child, "\ntest-text")
      }
    }
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            console.log("Secret: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}