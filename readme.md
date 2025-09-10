# GraphQL Book API (CRUD Application)

A simple CRUD (Create, Read, Update, Delete) application built with Node.js, Express, and GraphQL to manage books and authors.

## Features

- **Create**: Add new books and authors
- **Read**: Query all books/authors or a single book/author by ID
- **Update**: Edit existing books and authors
- **Delete**: Remove books and authors

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm

### Installation

1. Clone the repository or download the source code.
2. Install dependencies:

   ```sh
   npm install
   ```

### Running the Server

Start the server in development mode with nodemon:

```sh
npm run devStart
```

The server will start on [http://localhost:3000/graphql](http://localhost:3000/graphql).

### Using the API

Open [http://localhost:3000/graphql](http://localhost:3000/graphql) in your browser to access the GraphiQL interface.

#### Example Queries & Mutations

**Get all books:**
```graphql
{
  books {
    id
    name
    author {
      id
      name
    }
  }
}
```

**Add a new author:**
```graphql
mutation {
  addAuthor(name: "New Author") {
    id
    name
  }
}
```

**Add a new book:**
```graphql
mutation {
  addBook(name: "New Book", authorId: 1) {
    id
    name
    author {
      name
    }
  }
}
```

**Update a book:**
```graphql
mutation {
  updateBook(id: 1, name: "Updated Book Name", authorId: 2) {
    id
    name
    author {
      name
    }
  }
}
```

**Delete a book:**
```graphql
mutation {
  deleteBook(id: 1) {
    id
    name
  }
}
```

## Project Structure

- `server.js` - Main server and GraphQL schema
- `package.json` - Project metadata and scripts

