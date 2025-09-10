const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} = require("graphql");
const app = express();

let authors = [
  { id: 1, name: "J.K.Rowling" },
  { id: 2, name: "J.R.R.Tolkien" },
  { id: 3, name: "Brent Weeks" },
];

let books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => authors.find((author) => author.id === book.authorId),
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author of a book",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => books.filter((book) => book.authorId === author.id),
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A Single Book",
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    author: {
      type: AuthorType,
      description: "A Single Author",
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => authors.find((author) => author.id === args.id),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => authors,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    // CREATE
    addBook: {
      type: BookType,
      description: "Add a new book",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add a new author",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length > 0 ? authors[authors.length - 1].id + 1 : 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
    // UPDATE
    updateBook: {
      type: BookType,
      description: "Update a book",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        authorId: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const book = books.find((b) => b.id === args.id);
        if (!book) return null;
        if (args.name !== undefined) book.name = args.name;
        if (args.authorId !== undefined) book.authorId = args.authorId;
        return book;
      },
    },
    updateAuthor: {
      type: AuthorType,
      description: "Update an author",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        const author = authors.find((a) => a.id === args.id);
        if (!author) return null;
        if (args.name !== undefined) author.name = args.name;
        return author;
      },
    },
    // DELETE
    deleteBook: {
      type: BookType,
      description: "Delete a book",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const bookIndex = books.findIndex((b) => b.id === args.id);
        if (bookIndex === -1) return null;
        const deleted = books[bookIndex];
        books.splice(bookIndex, 1);
        return deleted;
      },
    },
    deleteAuthor: {
      type: AuthorType,
      description: "Delete an author (and their books)",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const authorIndex = authors.findIndex((a) => a.id === args.id);
        if (authorIndex === -1) return null;
        const deleted = authors[authorIndex];
        authors.splice(authorIndex, 1);
        // Remove all books by this author
        books = books.filter((b) => b.authorId !== args.id);
        return deleted;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});