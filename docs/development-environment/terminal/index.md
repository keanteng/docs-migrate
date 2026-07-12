---
sidebar_position: 3
sidebar_label: Terminal
title: Terminal Tips — Windows & Ubuntu
---

## Deleting Unwanted Programs with Winget

It seems impossible to uninstall certain programs via the Windows GUI. To force uninstall them, use the following command in Windows Terminal (run as Administrator):

```powershell showLineNumbers
winget list

# Find the exact name of the program you want to uninstall from the list
winget uninstall <program_name>
```

## Using Oh-My-Posh for Custom Terminal Prompts

Oh-My-Posh is a popular prompt theme engine for Windows Terminal that allows you to customize your terminal prompt with various themes and segments. To install and set up Oh-My-Posh, follow these steps:

```powershell showLineNumbers
# installing oh-my-posh
winget install JanDeDobbeleer.OhMyPosh --source winget

# set up oh-my-posh
New-Item -Path $PROFILE -Type File -Force
notepad $PROFILE
oh-my-posh init pwsh | Invoke-Expression

# set theme
. $PROFILE
```

## Get Tree Structure of Directories

To visualize the directory structure in a tree format, you can use the `tree` command in both Windows and Ubuntu terminals.

```bash showLineNumbers
# install
sudo apt install tree

# usage
tree /path/to/directory

# show only directories
tree -d /path/to/directory

# show 2 level depth
tree -L 2 /path/to/directory

# ignore certain files or directories
tree --prune -I 'node_modules|*.log' /path/to/directory
```
