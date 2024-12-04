# workspace-api-node-ts

## Prerequisites

| **Package** | **Version** |
| ----------- | ----------- |
| Node        | v18.16.0    |
| Yarn        | 1.22.x      |
| Postgres    | 14.0        |
| Liquibase   | 4.17.0      |

## Development Environment Setup

### Set required Node Version

```sh
nvm use
```

### Install dependencies

```sh
yarn # to install dependencies
```

### ENV Update

- Create .env from .env.example file and place required values

### DB Setup

- Create new DB Application manually.
- Update `liquibase.properties` file for DB credentials
- Run migrations for your local DB using `yarn liquibase`

## Middleware

### acl

- It is utilized to verify user permissions.

### auth

- It verifies the validity of authentication tokens.
- It checks whether the user exists in the database or not.

## Types

- type.ts: This file is used for managing data types within the application.
- misc.ts: In this file, we manage and store enumerations (enums). These enums are shared with the frontend via the misc module, facilitating consistency in enum values between both the frontend and backend components.


### Database
- There is a docker compose file available for running a local database or to use as automated testing. 
- In test-config/start-db.js file, the configuration for the following is written
1. Starting a local postgres Database.
2. Using Liquibase to run change sets in that particular database.
