# Multi-Tag

When installed, right-clicking on a folder will bring up an option to add a tag to all notes within a folder. Upon clicking this, a message will pop up asking you to add a tag. You may add your tag, and it will be appended to each note in the folder.

You can also select multiple notes with Shift+Mouse, and right-click the selection to get the same efect.

If you want your tags to be appended to the frontmatter via YAML/Properties, there is a toggle for this in the plugin's Settings menu. "YAML" will add the tags as a property, and "Inline" will append each tag to the bottom of the note. Note that "YAML" checks for duplicate tags, but "Inline" does not.

# Installation:

This project is available as a community plugin in Obsidian that can be installed directly in the app, under the name `Multi Tag`.

If you wish to install it manually,

1. Download the latest release.
2. Extract the folder within the release and add it to `[yourVault]/.obsidian/plugins/`.

## Ideas for Features:

- [x] Settings option for whether tag appears in YAML or bottom of file.

## Next Steps:

- [x] Update obsidian typing so "files-menu" is properly implemented.
- [x] Allow user to change between YAML/Inline directly from the form instead of needing to go into Settings.
- [x] Clean up code. It's kind of messy right now.
- [ ] Try converting to front-end framework to make forms easier to manage. Will try Svelte.
- [ ] Add tests.
