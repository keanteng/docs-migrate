---
sidebar_position: 4
sidebar_label: VSCode
title: Visual Studio Code (VSCode) Tips
---

## Add Indent Highlight on VS Code File Explorer

The selected file will have indent highlight to show the folder structure better, especially for nested folders. Add this to your `settings.json`:

```json showLineNumbers
"workbench.tree.indent": 15,
"workbench.tree.renderIndentGuides": "always",
"workbench.colorCustomizations": {
  "tree.indentGuidesStroke": "#47ef05"
}
```
