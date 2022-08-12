const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

import Link from "next/link";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

export default function Home({ posts }) {
  return (
    <div>
      <h1>Hello From The Home Page!</h1>
      {posts.map((post) => {
        return (
          <ul key={post.slug}>
            <li>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          </ul>
        );
      })}
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "http://renegate1.beget.tech/graphql",
    cache: new InMemoryCache(),
  });

  const response = await client.query({
    query: gql`
      query HomePageQuery {
        posts {
          edges {
            node {
              title
              slug
              uri
              excerpt
              content
            }
          }
        }
      }
    `,
  });

  const posts = response.data.posts.edges.map(({ node }) => node);
  console.log(posts);

  return {
    props: {
      posts,
    },
  };
}
