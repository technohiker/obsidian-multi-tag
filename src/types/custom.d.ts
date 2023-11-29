//Adding files-menu method to Obsidian's type file.
import {} from "obsidian";

declare module "obsidian" {
	interface Workspace {
		on(
			name: "files-menu",
			callback: (
				menu: Menu,
				file: TAbstractFile[],
				source: string,
				leaf?: WorkspaceLeaf
			) => any,
			ctx?: any
		): EventRef;
		on(
			name: "search:results-menu",
			callback: (menu: Menu, leaf: any) => any,
			ctx?: any
		): EventRef;
	}
}
