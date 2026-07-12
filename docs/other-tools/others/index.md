---
sidebar_position: 8
sidebar_label: Others
title: Some Setup Tips
---

This section contains some of my learnings when working with some side projects

## Using Mlflow3

Mlflow3 is a powerful tool for managing machine learning experiments. Here are some tips for setting up and using Mlflow3 effectively:

```bash
export PATH="$PATH:/C/Users/benjamine/AppData/Local/Programs/Python/Python312/Scripts"

py -3.12 -m mlflow server --host 127.0.0.1 --port 8080 --workers 1 --backend-store-uri sqlite:///mlflow.db
```

## Installing PyManager

To install PyManager, use the following command:

```bash
# you should install using python website
# list the available package
pymanager list --online

# download the specific version
pymanager install 3.10

# get the requirements to specific version
# use older version due to library support issue
py -3.12 -m pip install -r requirements.txt
```
