---
sidebar_position: 3
sidebar_label: PostgreSQL & pgvector
title: Installing PostgreSQL, PgAdmin, Postgres Vector
---

## Installing PostgreSQL, PgAdmin, Postgres Vector

There are 2 parts here covering the Windows and WSL installation. For WSL installation, we will use [PgAdmin](https://www.pgadmin.org/) to connect to PostgreSQL installed in WSL.

### On Ubuntu

To install PostgreSQL and Postgres Vector, use the following commands:

```bash
# update your current packages
sudo apt update && sudo apt upgrade -y

# install necessary certificates to add the Postgres repo
sudo apt install -y dirmngr ca-certificates software-properties-common gnupg gnupg2 apt-transport-https curl

# add the official PostgreSQL repository key
curl -fSsL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor | sudo tee /usr/share/keyrings/postgresql.gpg > /dev/null

# add the repository to your system sources
echo deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main | sudo tee /etc/apt/sources.list.d/pgdg.list

# update the package list again to see the new repo
sudo apt update

# install PostgreSQL 16 and the pgvector extension
# (We use version 16 as it is stable and widely supported)
sudo apt install -y postgresql-16 postgresql-16-pgvector

# start the PostgreSQL service
sudo service postgresql start

# the newer way to start should be using systemctl
sudo systemctl start postgresql
```

**Creating Database For Project Usage**

To create a database for your project, use the following commands:

```sql
# change user to postgres to setup user and db
sudo -i -u postgres

# enter
psql
-- Create the user with the specified password
CREATE USER "CE223WQ" WITH PASSWORD 'password';

-- Create the database 'tnb' owned by this new user
CREATE DATABASE talent_nexus_ai OWNER "CE223WQ";

-- Connect to the new database
\c talent_nexus_ai

-- Enable the pgvector extension in this specific database
CREATE EXTENSION IF NOT EXISTS vector;

GRANT ALL ON SCHEMA public TO "CE223WQ";

-- Exit the SQL shell
\q
# exit postgres user session
exit
```

**Miscellaneous PostgreSQL Setup**

1. To avoid port clashing when you run PostgreSQL from Windows and WSL, we will set it such that we only start it when we want to:

```bash
# turn off ubuntu postgres to avoid clashing the port with windows
# avoid running postgres on both ubuntu and windows at the same time
sudo service postgresql stop
sudo systemctl disable postgresql
# check if postgres is running
service --status-all
sudo service postgresql status
```

2. If we really need to run on both environments, we can change the port of either Windows or WSL PostgreSQL. Here I will show you how to change the port in WSL:

```bash
# advanced: to change postgres port if needed
# change the port on ubuntu for postgresql
sudo nano /etc/postgresql/16/main/postgresql.conf
port=5433 # find this line and change
sudo service postgresql restart
```

3. If your senior wrote the SQL file and sent it to you, but you want to run it on Ubuntu terminal, you can use the following command:

```bash
# if someone has written an sql file you can run it like this
# no need copy
sudo -u postgres psql -d talent_nexus_ai -f sql-ref-creation.sql
\c talent_nexus_ai # view the created stuff here

# to connect directly to database
psql -d "talent_nexus_ai"
```

4. Allow PgAdmin to Connect to PostgreSQL in WSL by Editing `pg_hba.conf`:

```bash
# advanced: using pgadmin to listen on ubuntu postgres
# connect to pgadmin for ubuntu, change listening port and authenticate
sudo nano /etc/postgresql/16/main/postgresql.conf
listen_addresses='*' # uncomment and change
sudo nano /etc/postgresql/16/main/pg_hba.conf
host    all             all             0.0.0.0/0            scram-sha-256
sudo service postgresql restart
# if scram-sha-256 not work use md5 or change to trust then md5, restart everytime after such change
# but just change to trust for hassle free connection
```

5. When your senior gives you a list of CSV files with his laptop path, and you want to ingest it in WSL PostgreSQL, you can do the following:

```bash
cp /path/to/your/downloads/job_role_skills_data.csv /tmp/
chmod 644 /tmp/job_role_skills_data.csv

# faster
# Copy all CSVs from a folder to /tmp
cp /path/to/your/downloads/*.csv /tmp/

# Set permissions for all CSVs in /tmp
chmod 644 /tmp/*.csv

# then if we use the FROM command as postgres user we can just change to
FROM '/tmp/job_role_skills_data.csv'
# instead of the windows path
```

The good thing of this is that the file will only be temporarily stored in WSL and you can delete it after ingestion to save space.

6. You face permission denied error when you try to ingest CSV file, you can do the following:

```bash
-- Connect to your database first
psql -d talent_nexus_ai

-- Grant SELECT permission on the job_work_functions table
GRANT SELECT ON TABLE db_sem.job_work_functions TO "CE223WQ";

-- If you want to grant permissions on all tables in the schema at once:
GRANT SELECT ON ALL TABLES IN SCHEMA db_sem TO "CE223WQ";

-- To make sure future tables also get the permission automatically:
ALTER DEFAULT PRIVILEGES IN SCHEMA db_sem GRANT SELECT ON TABLES TO "CE223WQ";
```

7. You need to perform similarity search using trigram, you can enable the extension as follows:

```bash
sudo apt update
sudo apt install postgresql-contrib

sudo -i -u postgres
psql -d "talent_nexus_ai"
CREATE EXTENSION pg_trgm;
# check if installed
\dx
```

8. Make someone a superuser in PostgreSQL:

```sql
ALTER ROLE "CE223WQ" WITH SUPERUSER;
```

### On Windows

Windows will install everything for you so here are the commands on how to start the server:

```powershell
# use port 5433 since ubuntu use 5432
cd "C:\Program Files\PostgreSQL\16\bin"
pg_ctl init -D "C:\Users\CE223QW\pgsql_data"
& "C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe" start -D "C:\Users\CE223QW\pgsql_data" -o "-p 5432"
.\psql -p 5432 -U CE223QW -d postgres

# to stop
& "C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe" stop -D "C:\Users\CE223QW\pgsql_data"
```
