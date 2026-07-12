---
sidebar_position: 1
sidebar_label: WSL
title: Getting Started
---

:::info 
To read up on WSL, you can refer to the [official Microsoft documentation](https://learn.microsoft.com/en-us/windows/wsl/install). After installing WSL, open [Visual Studio Code](https://code.visualstudio.com/) and click on the bottom left green icon that looks like `><`.

:::

## Setting Up Windows Subsystem For Linux (WSL)

### Installation

To install the `wsl`, use the following command:

```bash showLineNumbers
wsl --install -d ubuntu

# shutdown
wsl --shutdown

# avoid docker overriding WSL default version
wsl --set-default Ubuntu

# update wsl
wsl --update
```

For older laptops, it is recommended to update WSL first if you are first time installing it. You might also come across a problem that you cannot open the file system in Ubuntu from File Explorer due to some Windows registry problem. Use the following script to resolve:

```powershell showLineNumbers
# Define the Registry Key Path
$regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\NetworkProvider\Order"

# Get the current ProviderOrder value
$currentOrder = (Get-ItemProperty -Path $regPath).ProviderOrder

Write-Host "Current Order: $currentOrder" -ForegroundColor Yellow

# Check if P9NP is already at the start
if ($currentOrder.StartsWith("P9NP")) {
    Write-Host "Success: P9NP is already at the top. No changes needed." -ForegroundColor Green
} else {
    # Remove P9NP from the list wherever it is
    $newOrderParts = $currentOrder -split "," | Where-Object { $_ -ne "P9NP" }

    # Add P9NP to the front
    $newOrder = "P9NP," + ($newOrderParts -join ",")

    # Update the Registry
    Set-ItemProperty -Path $regPath -Name "ProviderOrder" -Value $newOrder

    Write-Host "Fixed! New Order: $newOrder" -ForegroundColor Cyan
    Write-Host "Please RESTART your computer for the changes to take effect." -ForegroundColor Red
}
```

:::warning

Use the above script with caution as it will trigger IT security warning.

:::

## Resolving SSL or Secure Socket Layer Issue

You should put the path `/etc/ssl/certs/ca-certificates.crt` in your `.bashrc` or `.zshrc` file to make it permanent.

```bash showLineNumbers
sudo update ca-certificates
```

```bash title=".bashrc"
export AWS_CA_BUNDLE="/etc/ssl/certs/ca-certificates.crt"
export REQUESTS_CA_BUNDLE="/etc/ssl/certs/ca-certificates.crt"
export SSL_CERT_FILE="/etc/ssl/certs/ca-certificates.crt"
```

## Access File System from Windows Using File Explorer

To allow CRUD operations from Windows File Explorer to WSL filesystem, open File Explorer and in the address bar type:

```bash showLineNumbers
sudo chown -R $USER:$USER ~
# to open a folder from ubuntu in windows explorer
explorer.exe .
```

## Creating Virtual Environment — Python

By default, Python 3.12 is installed in WSL Ubuntu. To create a virtual environment, use the following commands:

```bash showLineNumbers
python3 -m venv .venv
source .venv/bin/activate
# to exit virtual environment
deactivate
```

:::info
However, you are advised to turn on the **Auto Activate Virtual Environment** extension in VSCode for automatic activation of virtual environment when you open the project folder. You first need to install the Virtual Environment extension from VSCode marketplace.
:::

## Configuring WSL For Long Term

WSL can eat your RAM and disk space. Furthermore, you can add your laptop network setting and sync with it by changing the `.wslconfig` file in your Windows user folder `C:\Users\<username>\.wslconfig`.

Create the file if it doesn't exist:

```bash
touch ~/.wslconfig
```

Here is my recommended configuration:

```bash title=".wslconfig"
[wsl2]
memory=16GB
defaultVhdSize=128GB
networkingMode=NAT
dnsTunneling=false
autoProxy=false
firewall=false
```

Shutdown WSL using `wsl --shutdown` command and restart WSL to take effect.

## Removing Unwanted Install

To avoid increasing the WSL size, you can remove unwanted packages using the following command:

```bash
# here are just some examples
sudo apt-get purge 'texlive-*'
sudo apt-get autoremove
sudo apt-get autoclean
```
