---
sidebar_position: 6
sidebar_label: Talent Nexus AI
title: Learning From Talent Nexus AI
---

## Viewing Cloud Logs from EKS on EC2

To view the logs from your EKS cluster running on EC2 instances, you can use the following command:

```bash
# go to tnbgai-dev-jhost-003
sudo -I

# get the pods on dev-uc
k get pods -n dev-uc
k logs tnbgai-dep-talent-nexus-ai-k8s-646b94cbcf-45dsb -n dev-uc --timestamps
# the log id will change everyday so need to check the pod name again

# delete pods
k delete pods tnbgai-dep-talent-nexus-ai-k8s-646b94cbcf-45dsb -n dev-uc

# check pods details
k describe pods tnbgai-dep-talent-nexus-ai-k8s-646b94cbcf-45dsb -n dev-uc

# delete evicted pods all
k get pods -n dev-uc | grep Evicted | awk '{print $1}' | xargs k delete pod -n dev-uc

# view live logs from all running pods
k logs -f -n dev-uc app=tnbgai-dep-talent-nexus-ai-k8s --all-containers=true
```

## Accessing DB on RDS

To access the database on RDS, you can use the following command:

```bash
psql -host=<rds-endpoint> -port=5432 --username=dbadmin --password --dbname=talent_nexus_ai
```

## Visiting weKNOW Web When At Home

We can use EC2 instance to access the weKNOW application:

- Go to EC2, Region `ap-southeast-1` and select `dev-window`
- Select RDP Client then Fleet Manager
- Then select Login with SSO
