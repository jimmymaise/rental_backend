<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).

## Note
if graphql.schema.ts NOT exist
```
ts-node generate-typings
```

```
https://github.com/apollographql/apollo-server/issues/4463
upgrade to apollo-server-fastify@3.0.0-alpha.3
```

# GraphQL Query
```
query {
  whoAmI {
    id,
    name,
    email
  }
}

mutation {
  loginByEmail(
    email: "alice@prisma.io"
    password: "graphql"
  ) {
    accessToken
    user {
      id,
      name,
      email
    }
  }
}
```

## Update Table Changed
```
npm run prisma:mirgation-save
npm run prisma:mirgation-up
npm run prisma:generate
```

## Upload file Graphql PostMan
```
curl --location --request POST 'http://localhost:3000/graphql' \
--header 'Connection: keep-alive' \
--header 'accept: */*' \
--header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36' \
--header 'content-type: application/json' \
--header 'Origin: http://localhost:3000' \
--header 'Sec-Fetch-Site: same-origin' \
--header 'Sec-Fetch-Mode: cors' \
--header 'Sec-Fetch-Dest: empty' \
--header 'Referer: http://localhost:3000/graphql' \
--header 'Accept-Language: en-US,en;q=0.9' \
--form 'operations={"query":"mutation uploadItemImage($file:Upload!) {\n uploadItemImage(file:$file)\n}", "variables": { "file": null }}' \
--form 'map={ "0": ["variables.file"] }' \
--form '0=@/C:/Users/trank/Desktop/_home_black_bib-server_data_2020_VJM2020_On Course_lmk (1475).jpg'
```

## Create new Item
```
mutation {
  listingNewItem (
    itemData: {
      name: "đồ cho thuê",
      categoryIds: ["de9706c6-1495-4d3b-9cb5-0634f5d7201a", "ffb1fd1c-1951-466b-93a9-82c6347fd998"],
      areaIds: ["02ade86c-1b4b-4fd5-8731-cf064253222c"],
      images: [{
        id: "118c26c0-105a-4961-9ffa-a0a48ebb9872",
        url: "https://storage.googleapis.com/asia-item-images/1604845880312-_home_black_bib-server_data_2020_VJM2020_On Course_lmk (1476).jpg"
      }]
    }
  ) {
    id,
    name,
    images {
      id,
      url
  	},
    createdDate
  }
}

{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmZWI5NDFmNi1hM2UyLTQzMTAtYmRhMC1mM2VkNTk5MjlmYjEiLCJlbWFpbCI6ImFsaWNlQHByaXNtYS5pbyIsImlhdCI6MTYwNTM0OTg0OCwiZXhwIjoxNjA1MzUzNDQ4fQ.0FAICaz5IUeGICSzU4p1uyarGTY0BOv5G47acTNJdC4"
}
```

## query items 
```
query {
  feed(query: { search: "kho khan", areaId: "d261e703-55af-4823-a059-afca6a551b80", includes: ["categories"] }) {
    items {
      id,
      name,
      description,
      status,
      categories {
        id,
        name,
        imageUrl
      },
      areas {
        id,
        name
      }
    },
    total
  }
}
```