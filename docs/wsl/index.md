---
sidebar_position: 1
sidebar_label: WSL
title: Getting Started
---

To read up on WSL, you can refer to the [official Microsoft documentation](https://learn.microsoft.com/en-us/windows/wsl/install). After installing WSL, open [Visual Studio Code](https://code.visualstudio.com/) and click on the bottom left green icon that looks like `><`.

## Setting Up Windows Subsystem For Linux (WSL)

### Installation

To install the package, use the following command. Note the usage of `sudo`.

```bash
wsl --install -d ubuntu

# shutdown
wsl --shutdown

# avoid docker overriding WSL default version
wsl --set-default Ubuntu

# move your current directory to WSL filesystem
# might be slow if you are moving from mnt/c/ to wsl
sudo cp -r . /home/keanteng/repositories

# update wsl
wsl --update

# delete unwanted file
sudo rm -rf <filename>
```

For older laptops, it is recommended to update WSL first if you are first time installing it. You might also come across a problem that you cannot open the file system in Ubuntu from File Explorer due to some Windows registry problem. Use the following script to resolve:

```powershell
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

> **Warning:** Use the above script with caution as it will trigger IT security warning.

## Resolving SSL or Secure Socket Layer Issue

### Option 1 — `.pem` File

First you need to get a `.pem` file. To download it, go to Edge Browser, navigate to `google.com`, then click on the lock icon in the address bar → click Certificate → click Details → click ZScaler Root CA → click Export. Save it as `<filename>.pem`.

To move the file to WSL system:

```bash
# make sure you are in the Windows path where the .pem is stored
# general zscaler
sudo cp <filename>.pem /home/keanteng/
sudo cp zscaler-root.pem /usr/local/share/ca-certificates/zscaler.crt
sudo update-ca-certificates

# if the above does not work, try this
# zscaler for aws
curl https://www.amazontrust.com/repository/AmazonRootCA1.pem -o /tmp/AmazonRootCA1.pem
sudo cp /tmp/AmazonRootCA1.pem /usr/local/share/ca-certificates/
sudo update-ca-certificates
export AWS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
```

**Some SSL Issues Documentations:**

I accidentally messed up the DNS setting of WSL and during `pip install` the download speed became very slow and I got SSL error when using the `Zscaler-Root-Ca.pem`.

It turned out to be an IPv6 issue. To resolve it, do the following:

```bash
# What happened: You enabled networkingMode=mirrored in your config
# (likely to help gemini-cli connect). This is actually a good setting,
# BUT it enables IPv6. Zscaler often blocks or ignores IPv6 traffic
# without telling your computer.
#
# The Result: Every time you ran pip, your computer tried to connect
# via IPv6, waited 60 seconds for a response that never came (the pause),
# timed out, and then switched to IPv4 (which worked).

sudo nano /etc/sysctl.conf
# add these lines at the end
net.ipv6.conf.all.disable_ipv6 = 1
# you can also change dns to google and cloudflare which will speed up
# your wsl experience
```

You should put the path `/etc/ssl/certs/ca-certificates.crt` in your `.bashrc` or `.zshrc` file to make it permanent.

```bash
export AWS_CA_BUNDLE="/etc/ssl/certs/ca-certificates.crt"
export REQUESTS_CA_BUNDLE="/etc/ssl/certs/ca-certificates.crt"
export SSL_CERT_FILE="/etc/ssl/certs/ca-certificates.crt"
```

### Option 2 — Environment Variables

Python code cannot run due to SSL, because we set it at the system level but not in Python.

```bash
# do this
cat ~/zscaler-root.pem >> $(python -m certifi)
```

### Option 3 — Windows Bash Terminal

SSL issue can also occur on Windows when you are first time using AWS as well as using Google AI services like Gemini. The following URL will be blocked:

- `https://generativelanguage.googleapis.com`

## Access File System from Windows Using File Explorer

To allow CRUD operations from Windows File Explorer to WSL filesystem, open File Explorer and in the address bar type:

```bash
sudo chown -R $USER:$USER ~
# to open a folder from ubuntu in windows explorer
explorer.exe .
```

## Creating Virtual Environment — Python

By default, Python 3.12 is installed in WSL Ubuntu. To create a virtual environment, use the following commands:

```bash
python3 -m venv .venv
source .venv/bin/activate
# to exit virtual environment
deactivate
```

However, you are advised to turn on the **Auto Activate Virtual Environment** extension in VSCode for automatic activation of virtual environment when you open the project folder. You first need to install the Virtual Environment extension from VSCode marketplace.

## Configuring WSL For Long Term

WSL can eat your RAM and disk space. Furthermore, you can add your laptop network setting and sync with it by changing the `.wslconfig` file in your Windows user folder `C:\Users\<username>\.wslconfig`.

Create the file if it doesn't exist:

```bash
touch ~/.wslconfig
```

Here is my recommended configuration:

```ini
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
