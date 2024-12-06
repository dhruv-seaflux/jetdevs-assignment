# workspace-api-node-ts

## Prerequisites

| **Package** | **Version** |
| ----------- | ----------- |
| Node        | v18.20.0    |
| Yarn        | 1.22.x      |
| Liquibase   | 4.17.0      |
| BullMQ      | 5.31.1      |

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


### Database
- There is a docker compose file available for running a database container 
```
docker-compose up -d
```
- There is a docker compose file available for running redis container 
```
docker-compose -f docker-compose.redis.yaml up -d
```

The container for redis is required as the messaging queue integrated in this app is **BullMQ**.

## Postman Collection
At the root path there is a folder name `postman-collection` that contains postman collection to test the API.

File name : `JETDEVS - Assignment.postman_collection.json`

## Important Commands
| **command** | **UseCase** |
| ----------- | ----------- |
| yarn start        | To start a local express server of current app    |
| yarn build        | To create a build of current app                  |
| yarn test         | To run the test cases of current app              |

