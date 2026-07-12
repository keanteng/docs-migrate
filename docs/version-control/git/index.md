---
sidebar_position: 2
sidebar_label: Git
title: Git Version Control Tips
---

## Deleting Unwanted Files

For committed files, sometimes deletion won't remove them, we need to remove them from tracking:

```bash
git rm -r --cached folder
```

## Setting Up Remote Committing to AWS CodeCommit

To set up codecommit, use the following commands:

```bash
# if you are on windows
export PATH="$PATH:/C/Users/benjamine/AppData/Local/Programs/Python/Python312/Scripts"

# make sure directory is correct
cd my_folder
# create a new branch called benjamine
git checkout -b benjamine
# first time commit name and email setup
git config user.name "benjamine"
git config user.email "benjamine.github.com"
git add .
git commit -m "Your changes"
git push -u origin benjamine
```

## Renaming Remote Branch on Cloud Repo

To rename a remote branch on your cloud repository, use the following commands:

```bash
git branch -m old-name new-name
git push origin new-name
git push --set-upstream origin new-name
git push origin --delete old-name
```

## Divergent Branches Issue

If you encounter divergent branches issue when pushing to remote repository, use the following command to merge the changes:

```bash
# ties the history together
git pull origin sprint-1 --no-rebase

# local history on top of incoming changes
git pull origin sprint-1 --rebase
```

## Stash & Pop Changes

If you want to temporarily save your changes without committing them, you can use the stash command:

```bash
git stash          # Stash your changes
git stash pop      # Apply the stashed changes back to your working directory

# remove the stashes
git stash clear

# show the history of stashes
git stash list

# go to a specific stash
git stash apply stash@{0}
```

## Adding Commit Count to Git Prompt

Here is a simple way to add commit count to your git prompt in terminal:

```bash
# go to ~/.zshrc
nano ~/.zshrc
# Custom Git Commit Function
gcom() {
    # Get count and increment
    local count=$(git rev-list --count HEAD)
    local next=$((count + 1))

    # Add changes
    git add .

    # Determine message
    if [ -z "$1" ]; then
        local msg="auto commit #$next"
    else
        local msg="$1 #$next"
    fi

    # Commit
    git commit -m "$msg"
}
# update .zshrc
source ~/.zshrc
# Usage:
gcom "Your custom message"

# or just
git add . && git commit -m "auto commit #$(($(git rev-list --count HEAD) + 1))"
```

## Working With Multiple Branches In Teams

We can create Pull Request using terminal but it is error prone:

```bash
aws codecommit create-pull-request \
    --title "Added login feature" \
    --description "Please review my changes for the login page" \
    --repository-name MyRepoName \
    --source-reference feature/my-new-feature \
    --destination-reference main
```

Of course we can create script function to do this but it is better to use the web console to create Pull Request to avoid mistakes.

It is normal to have multiple branches when working in team project. Here is a suggested workflow to create a branch for a new feature:

```bash
git checkout -b feature/new-button
git commit -m "added button"
git push origin feature/new-button
```

After that we add a new PR to the main branch. Then we should delete the feature branch after merging to keep the repo clean.

```bash
git push origin --delete feature/new-button

# also delete local branch
git checkout main
git pull                  # Get the updated code with your changes
git branch -d feature/new-button
```

To avoid ghost branch use the following command to see all branches:

```bash
git fetch -p
git branch -a
```

## Using Git Tags

Git tags are useful to mark specific points in your repository's history, such as releases. Here are some common commands for working with Git tags:

```bash
# Switch to main and pull latest code
git checkout main
git pull

# Create the tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push the tag to AWS
git push origin v1.0.0
# List all tags
git tag
```

We should not use Git Tags unless we have some stable release version to mark. Avoid using tags for daily commits.

## Pull Request Using Terminal — The Fast Way

To create a Pull Request using terminal in a fast way, you can use the following script:

```bash
function awspr() {
  # Usage: awspr "Title" "RepoName" "SourceBranch" "TargetBranch (optional)"

  local title="$1"
  local repo_name="$2"
  local source_branch="$3"
  # Default target is "main", but you can override it as the 4th argument
  local dest_branch="${4:-main}"

  # 1. Validation
  if [[ -z "$title" || -z "$repo_name" || -z "$source_branch" ]]; then
    echo "Error: Missing arguments."
    echo "Usage: awspr \"Title\" \"RepoName\" \"SourceBranch\" \"TargetBranch(optional, default=main)\""
    return 1
  fi

  # 2. SAFETY CHECK
  echo "---------------------------------------------"
  echo "PREVIEW: You are about to create a PR"
  echo "---------------------------------------------"
  echo "Title:        $title"
  echo "Repository:   $repo_name"
  echo "From Branch:  $source_branch"
  echo "Into Branch:  $dest_branch"
  echo "---------------------------------------------"

  # 3. Confirmation
  echo -n "Are these details correct? (y/n): "
  read -q response
  echo ""

  if [[ "$response" != "y" ]]; then
    echo "Operation cancelled."
    return 0
  fi

  echo "Executing AWS Command..."

  # 4. Execute (FIXED: Using --targets)
  aws codecommit create-pull-request \
      --title "$title" \
      --description "$title" \
      --targets repositoryName="$repo_name",sourceReference="$source_branch",destinationReference="$dest_branch"

  echo "\nPull Request Created!"
}
```

To use the function, simply call it with the required parameters:

```bash
awspr "Added login feature" "MyRepoName" "feature/my-new-feature" "main"

# for speed use this
awspr "Added login feature" "MyRepoName" $(git branch --show-current)
```

To avoid the function above clogging up your `.zshrc`, put it in a separate file and source it when needed:

```bash
mkdir -p ~/.zsh/functions
# For example, move your git functions to a file
nano ~/.zsh/functions/git-helpers.sh
# Add this to your ~/.zshrc
# Load custom functions
if [ -d ~/.zsh/functions ]; then
    for func_file in ~/.zsh/functions/*.sh; do
        [ -f "$func_file" ] && source "$func_file"
    done
fi
```

## Find Aggregated Commits by Author

To find all the aggregated commits by all authors in the repository, use the following command:

```bash
git shortlog -sne --all
```
