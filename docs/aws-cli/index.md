---
sidebar_position: 5
sidebar_label: AWS CLI
title: AWS CLI Tips
---

## Check Bedrock Quota Limit Using AWS CLI

To check your Bedrock quota limit using AWS CLI, use the following command:

```bash
aws service-quotas list-service-quotas \
  --service-code bedrock \
  --query "Quotas[?contains(QuotaName, 'Claude Sonnet') && contains(QuotaName, '4.5')].[QuotaName, Value, Unit]" \
  --output table
```

If you want to get the model ID for other models, you can use the following command:

```bash
# get model id
aws bedrock list-foundation-models \
  --query "modelSummaries[].{modelId:modelId,provider:providerName,modelName:modelName,output:outputModalities,input:inputModalities}" \
  --output table

# get inference profile
aws bedrock list-inference-profiles \
  --query "inferenceProfileSummaries[].{id:inferenceProfileId,name:inferenceProfileName,status:status}" \
  --output table
```

## List All Running EC2 Instances

To list all running EC2 instances in a specific region, use the following command:

```bash
# show all instances
aws ec2 describe-instances \
  --query "Reservations[].Instances[].{
    Name: Tags[?Key=='Name']|[0].Value,
    InstanceId: InstanceId,
    State: State.Name,
    Type: InstanceType,
    AZ: Placement.AvailabilityZone,
    PrivateIP: PrivateIpAddress,
    PublicIP: PublicIpAddress
  }" \
  --output table

# show only running instances
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query "Reservations[].Instances[].{
    Name: Tags[?Key=='Name']|[0].Value,
    InstanceId: InstanceId,
    Type: InstanceType,
    PrivateIP: PrivateIpAddress,
    PublicIP: PublicIpAddress
  }" \
  --output table
```

## Who Am I?

To find out the AWS identity you are currently using, you can use the following command:

```bash
aws sts get-caller-identity
```

Use the credential above to check what you can do:

```bash
aws iam list-attached-role-policies \
  --role-name AWSReservedSSO_TNBQEYDeveloperAccess_4999a040a109e7af \
  --output table
```

After checking, I am not an IAM user, but SSO user assuming IAM role. So my access is not long term.

## How Much The Account Spend Until Now?

To check how much your AWS account has spent until now in the current month, you can use the following command:

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-01-01,End=2026-01-24 \
  --granularity MONTHLY \
  --metrics UnblendedCost
```

## List Running EKS Clusters

To list all running EKS clusters in your AWS account, use the following command:

```bash
aws eks list-clusters --output table
```

Here are some commands once you know the cluster name:

```bash
# describe cluster
aws eks describe-cluster \
  --name tnbgai-dev-eks-cluster-001 \
  --query "cluster" \
  --output json

# list nodes in the cluster
aws eks list-nodegroups \
  --cluster-name tnbgai-dev-eks-cluster-001 \
  --output table

# describe node group
aws eks describe-nodegroup \
  --cluster-name tnbgai-dev-eks-cluster-001 \
  --nodegroup-name tnbgai-dev-eks-cluster-ng-001 \
  --output json

# see the pods in the cluster
aws eks update-kubeconfig --name tnbgai-dev-eks-cluster-001 --region ap-southeast-1 && kubectl get pods -A
```

You can install `kubectl` using the following command:

```bash
sudo apt-get update && sudo apt-get install -y kubectl

# check if installed
which kubectl
```

## CodeCommit Tips & Tricks

To list all repositories in AWS CodeCommit, use the following command:

```bash
aws codecommit list-repositories --query "repositories[].repositoryName" --output text
```

Some tips to work on a specific repository, use the following command:

```bash
# get the default branch of a repository
aws codecommit get-repository --repository-name MyRepo --query "repositoryMetadata.defaultBranch" --output text

# get the head commit of that branch
aws codecommit get-branch --repository-name "tnbgenai-app-llm-talent-nexus-ai" --branch-name master
```

List all the repos with their cloning URL:

```bash
aws codecommit list-repositories \
  --query "repositories[].repositoryName" \
  --output text |
tr '\t' '\n' |
while read -r repo; do
  url=$(aws codecommit get-repository \
    --repository-name "$repo" \
    --query "repositoryMetadata.cloneUrlHttp" \
    --output text)
  printf "%s\t%s\n" "$repo" "$url"
done | column -t -s $'\t'
```

## Estimating DB Connection

First get all the RDS instances:

```bash
# Lists all DB instance identifiers in the current region
aws rds describe-db-instances \
  --query "DBInstances[].DBInstanceIdentifier" \
  --output text
```

Then we run the below code to find the connection limit:

```bash
DBS=("tnbgai-dev-db-001" "tnbgai-dev-db-002" "tnbgai-test-db-001" "tnbgai-test-db-002")

printf "%-22s | %-35s | %-25s | %-10s | %-12s\n" "DBInstanceIdentifier" "ParameterGroup" "max_connections" "Source" "IsModifiable"

for db in "${DBS[@]}"; do
  # 1) Get the (first) DB parameter group name attached to the instance
  pg=$(aws rds describe-db-instances \
        --db-instance-identifier "$db" \
        --query "DBInstances[0].DBParameterGroups[0].DBParameterGroupName" \
        --output text 2>/dev/null)

  # If not found (or it's an Aurora cluster case), leave blanks gracefully
  if [[ -z "$pg" || "$pg" == "None" ]]; then
    printf "%-22s | %-35s | %-25s | %-10s | %-12s\n" "$db" "-" "-" "-" "-"
    continue
  fi

  # 2) Look up max_connections on that parameter group
  read value source ismod <<<"$(
    aws rds describe-db-parameters \
      --db-parameter-group-name "$pg" \
      --query "Parameters[?ParameterName=='max_connections'].[ParameterValue,Source,IsModifiable]" \
      --output text 2>/dev/null
  )"

  # Fallbacks if empty
  value=${value:-"-"}
  source=${source:-"-"}
  ismod=${ismod:-"-"}

  printf "%-22s | %-35s | %-25s | %-10s | %-12s\n" "$db" "$pg" "$value" "$source" "$ismod"
done
```

We will get something like `LEAST({DBInstanceClassMemory/9531392},5000)` but the exact amount is not known. Let's check the instance type:

```bash
aws rds describe-db-instances \
  --db-instance-identifier tnbgai-dev-db-001 \
  --query "DBInstances[0].{Id:DBInstanceIdentifier,Class:DBInstanceClass,Engine:Engine}" \
  --region ap-southeast-1 \
  --output table
```

We will estimate as follows:

```
max_connections = LEAST(DBInstanceClassMemory / 9531392, 5000)
                = LEAST(4294967296 / 9531392, 5000)
                ≈ LEAST(450.4, 5000)
                ≈ 450
```
