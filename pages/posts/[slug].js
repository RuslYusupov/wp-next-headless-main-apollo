import Image from "next/image";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

export default function Post(post, site) {
  return (
    <div>
      <h1>{post.post.title}</h1>
      <Image
        width="640"
        height="426"
        src={post.post.featuredImage.node.sourceUrl}
      />
      <article
        dangerouslySetInnerHTML={{ __html: post.post.content }}
      ></article>
    </div>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { slug } = params;

  const client = new ApolloClient({
    uri: "http://renegate1.beget.tech/graphql",
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PostBySlug($slug: String!) {
        generalSettings {
          title
        }
        postBy(slug: $slug) {
          id
          content
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    `,
    variables: {
      slug: slug,
    },
  });

  const post = data?.data.postBy;

  const site = {
    ...data?.data.generalSettings,
  };

  return {
    props: {
      post,
      site,
    },
  };
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: "http://renegate1.beget.tech/graphql",
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      {
        posts(first: 10000) {
          edges {
            node {
              id
              title
              slug
              content
              featuredImage {
                node {
                  sourceUrl
                }
              }
            }
          }
        }
      }
    `,
  });

  const posts = data?.data.posts.edges.map(({ node }) => node);

  return {
    paths: posts.map(({ slug }) => {
      return {
        params: {
          slug: slug,
        },
      };
    }),
    fallback: false,
  };
}
