---
sidebar_position: 2
sidebar_label: Installing Programs
title: Installing Useful Programs
---

## Installing AWS CLI

To install AWS CLI, use the following commands:

```bash showLineNumbers
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

After installation you can setup your profile by typing `aws configure sso`. To update the software use the following command:

```bash showLineNumbers
# to update
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install --bin-dir /usr/local/bin --install-dir /usr/local/aws-cli --update
```

First check if AWS is not the Windows version:

```bash
which aws
```

You might get SSL issue when you first time configure, add to your `.zshrc` or `.bashrc`:

```bash title=".bashrc"
export AWS_CA_BUNDLE="/etc/ssl/certs/ca-certificates.crt"
export REQUESTS_CA_BUNDLE="/etc/ssl/certs/ca-certificates.crt"
export SSL_CERT_FILE="/etc/ssl/certs/ca-certificates.crt"
```

It would be bad if we need to rerun `aws configure sso` every time we open a new terminal. To avoid that, we can instead run:

```bash
aws sso login --profile <profile_name>
```

## Installing Oh My Zsh

If you want the terminal to look cool like a pro, check out [Oh My Zsh](https://ohmyz.sh/).

```bash showLineNumbers
sudo apt update
sudo apt install zsh -y
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

If you want to activate the Powerlevel10k theme, do the following:

First install the fonts:
- [MesloLGS NF Regular](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf)
- [MesloLGS NF Bold](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf)
- [MesloLGS NF Italic](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf)
- [MesloLGS NF Bold Italic](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf)

```bash
# install powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

Then configure your theme:

```bash title=".zshrc"
ZSH_THEME="powerlevel10k/powerlevel10k" 
```

You can run `p10k configure` to reconfigure the theme. But before that make sure you change the font settings on both terminal and VSCode to MesloLGS NF. This is super important.

There are cases where the terminal does not load properly and to ensure all the terminal sessions are properly loaded, use the following code:

```bash showLineNumbers title=".zshrc"
if [[ -o interactive ]]; then
  source ~/.zshrc
fi
```

## Installing Golang

To install Golang, use the following command:

```bash showLineNumbers
sudo apt update && sudo apt upgrade -y

wget -4 https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz

# add go to path
echo 'export PATH="/usr/local/go/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# verify installation
go version
```

## Installing Zip, Unzip and Git

To install zip, unzip and git, use the following command:

```bash showLineNumbers
sudo apt install zip unzip git -y
```

Here is how you can zip the file:

```bash
zip -r filename.zip foldername
```

## Installing Claude Code

Here I will show you how to use Claude Code:

```bash
# install
curl -fsSL https://claude.ai/install.sh | bash
```

```bash title=".zshrc"
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export ANTHROPIC_MODEL='global.anthropic.claude-sonnet-2'
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=8192
export MAX_THINKING_TOKENS=2048
export AWS_PROFILE=<profile_name>
```

> Don't use too much to avoid blowing up your AWS credits.

## Installing Azure Functions

To install Azure Functions, use the following commands:

```bash showLineNumbers
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/microsoft.gpg > /dev/null
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-$(lsb_release -cs 2>/dev/null)-prod $(lsb_release -cs 2>/dev/null) main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-get install azure-functions-core-tools-4
sudo apt-get update
func # if it shows something then install is success
```

## Installing LibreOffice

To install LibreOffice, use the following commands:

```bash showLineNumbers
sudo apt update
sudo apt install libreoffice
```

## Installing Docker

The local Docker Desktop is heavy and eats a lot of RAM. Instead, we can install Docker Engine in WSL Ubuntu. To install Docker Engine, use the following commands:

```bash showLineNumbers
# 1. Update apt and install packages to allow apt to use a repository over HTTPS
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg

# 2. Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. Set up the repository
echo \
  "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Add your user to the docker group (So you don't need 'sudo' to run docker commands)
sudo usermod -aG docker $USER
```

However, Docker will start when Ubuntu starts which will hog memory, to stop it when not in use:

```bash showLineNumbers
# Disable the service from starting at boot
sudo systemctl disable docker

# Disable the socket activation (prevents it from starting if something touches the socket)
sudo systemctl disable docker.socket

# Stop it
sudo systemctl stop docker docker.socket

# Start it again when needed
sudo systemctl start docker docker.socket
```

## Installing NodeJS

To install NodeJS, use the following commands:

```bash showLineNumbers
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm --version
nvm install --lts
nvm use --lts

npm -v
```

## Installing Texlive

How I created this document? Using Texlive. To install Texlive, use the following commands:

```bash showLineNumbers
sudo apt update
sudo apt install texlive-latex-base texlive-latex-recommended texlive-latex-extra texlive-science latexmk python3-pygments
sudo apt install texlive-bibtex-extra biber
```

## Installing `uv`

`uv` is built with Rust and is lightning fast. To install `uv`, use the following command:

```bash showLineNumbers
curl -LsSf https://astral.sh/uv/install.sh | sh

# start venv
uv init
uv venv .venv

# to install package
uv add -r requirements.txt

# sync to pyproject.toml
uv sync
```

You can add `ruff` and also `ty` for linting, type checking and code formatting. You can also add `pre-commit` for pre-commit hook.

```bash
uv add ruff ty pre-commit

# run ruff
ruff check . --fix

# format code
ruff format

# type check
ty check .

# before git commit
pre-commit run
```

## Installing `brew`

`brew` is a package manager for Linux. To install `brew`, use the following command:

```bash showLineNumbers
sudo apt update && sudo apt install build-essential procps curl file git
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
```

## Installing `minikube`

We can install `minkube` on our local computer to simulate kubernetes cluster:

```bash showLineNumbers
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```