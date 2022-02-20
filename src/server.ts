import { ApolloServer, gql } from "apollo-server";
import responseCachePlugin from "apollo-server-plugin-response-cache";
import 'apollo-cache-control';

const typeDefs = gql`
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl (
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  type Book {
    title: String
    author: String @cacheControl(maxAge: 1000)
    itemType: ItemType @cacheControl(maxAge: 1000)
  }

  type Magazine {
    title: String
    author: String
    itemType: ItemType
  }

  type ItemType {
    id: Int
    name: String
    check: Int
  }

  type Query {
    book: Book
    magazine: Magazine
    itemTypes: [ItemType]
  }
`;

const itemTypes = [
  {
    id: 1,
    name: "paper",
    check: 1,
  },
  {
    id: 2,
    name: "electronic",
    check: 100,
  },
]

const book = {
  title: "book",
  author: "A",
  itemType: itemTypes[0],
};

const magazine = {
  title: "magegine",
  author: "B",
  itemType: itemTypes[1],
};

const resolvers = {
  Query: {
    book: ()  => {
      console.log('book call!')
      book.itemType.check++
      book.author += 'A'
      return book;
    },
    magazine: () => {
      console.log('magezine call!')
      magazine.itemType.check++
      return magazine
    },
    itemTypes: () => {
      console.log('itemtype call!')
      itemTypes[0].check++
      return itemTypes
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    responseCachePlugin(),
    // ApolloServerPluginCacheControl({
    //   defaultMaxAge: 10,
    // })
  ],
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

export default server;
