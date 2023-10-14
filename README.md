# Rental Business Backend Service

## Description

This is a backend service for a rental business, built using the [Nest](https://nestjs.com/) framework and TypeScript. This repository provides all the functionalities needed to manage rentals, users, and other related services.

## Technologies Used

- **Nest Framework**: A progressive Node.js framework for building scalable server-side applications.
- **TypeScript**: A superset of JavaScript that adds strong types.
- **Prisma**: An open-source database toolkit.
- **Apollo Server**: A GraphQL server for more efficient, powerful and flexible APIs.
- **Redis**: An in-memory data store used for caching.
- **Docker**: Platform to develop, ship, and run applications in containers.
- **PostgreSQL**: Open-source relational database.
  
## Installation

To install the project, follow these steps:

1. Clone the repository
2. Navigate to the project folder
3. Run `npm install`

## Running the App

### Development

Run `npm run start`

### Watch Mode

Run `npm run start:dev`

### Production Mode

Run `npm run start:prod`

## Testing

### Unit Tests

Run `npm run test`

### E2E Tests

Run `npm run test:e2e`

### Test Coverage

Run `npm run test:cov`

## Database Migration

### Update Table Changes

1. Run `npm run prisma:migration-save`
2. Run `npm run prisma:migration-up`
3. Run `npm run prisma:generate`

## Notes

- If `graphql.schema.ts` does not exist, run `ts-node generate-typings` and refer to [this issue](https://github.com/apollographql/apollo-server/issues/4463) for more details.
- Docker build must use `host.docker.internal` instead of `localhost` in `.env`.
- To drop all connection sessions to a database, run the provided SQL commands.

## License

This project is licensed under the MIT License.
