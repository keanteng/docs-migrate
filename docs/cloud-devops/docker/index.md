---
sidebar_position: 7
sidebar_label: Docker
title: Docker Usage Tips
---

## Basic Docker Commands

Here are some basic Docker commands that are useful for managing Docker containers and images:

```bash showLineNumbers
# run the image
docker run --name gremlin-server -p 8182:8182 tinkerpop/gremlin-server

# access through terminal
docker exec -it gremlin-server bash

# check the logs when restart
docker logs -f gremlin-server

# remove unused images, container and builds
docker image prune -a
docker builder prune
docker container prune -f
```

Here is an example for working with neo4j database where we see the logs, stop and remove the container:

```bash
docker run \
--name local-neo4j \
-p 7474:7474 -p 7687:7687 \
-d \
-e NEO4J_AUTH=neo4j/mypassword123 \
-e NEO4J_PLUGINS='["apoc"]' \
-e NEO4JLABS_PLUGINS='["apoc"]' \
neo4j:latest

docker logs -f local-neo4j

docker stop local-neo4j
docker rm local-neo4j
```
