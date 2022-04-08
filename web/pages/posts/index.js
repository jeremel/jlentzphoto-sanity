import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { groq } from "next-sanity";
import { usePreviewSubscription, urlFor } from "../../lib/sanity";
import { getClient } from "../../lib/sanity.server";
import styled from "styled-components";
import Link from "next/link";

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-size: 3rem;
    margin: 2rem auto;
  }

  figure {
    display: flex;
    justify-content: center;
    height: 55vh;
    margin: 0 auto;

    img {
      max-width: 75%;
      object-fit: cover;
    }
  }

  p {
    font-size: 1.5rem;
    max-width: 50%;
    margin: 2rem auto;
  }
`;

export default function Posts({ posts }) {
  return (
    <Container>
      <h2>Blog</h2>
      {posts.length > 0 &&
        posts.map(
          ({ _id, title = "", slug = "", publishedAt = "" }) =>
            slug && (
              <li key={_id}>
                <Link href="/posts/[slug]" as={`/posts/${slug.current}`}>
                  <a>{title}</a>
                </Link>
                - {new Date(publishedAt).toDateString()}
              </li>
            )
        )}
    </Container>
  );
}

export async function getStaticProps() {
  const posts = await getClient().fetch(groq`
    *[_type == "post" && publishedAt < now()] | order(publishedAt desc)
  `);
  return {
    props: {
      posts,
    },
  };
}
