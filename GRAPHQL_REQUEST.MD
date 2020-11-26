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

## Find all request from ME
```
query {
  findAllRequestFromMe {
    items {
      id,
      totalAmount,
      fromDate,
      toDate,
    },
    total,
    limit
  }
}
```

## Find all requests to ME (lender user)
```
query {
  findAllRequestToMe {
    items {
      id,
      totalAmount,
      fromDate,
      toDate,
    },
    total,
    limit
  }
}
```

## Refresh User Access Token

```
mutation {
  refreshUserAccessToken {
    accessToken
  }
}
```

## Sign Up By Email

```
mutation {
  signUpByEmail (
    email: "user_1@test.com",
    password: "123456"
  ) {
    accessToken
  }
}
```

## New Item Request 
```
mutation {
  newRequest(
    requestData: {
      itemId: "00012e81-650a-4e09-b9b2-4eed69726ac7"
      fromDate: 1606366800000
      toDate: 1606712400000
    }
  ) {
    itemId
    rentingItemCachedInfo {
      name,
      images {
        url
      }
    }
  }
}
```