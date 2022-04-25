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
  color: green;
  list-style: none;

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

const Post = styled.div`
  position: relative;

  img {
    height: 35vh;
    width: 100vw;
    object-fit: cover;
    object-position: center;
    filter: brightness(75%);
  }

  .postTitle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h3 {
      font-size: 2.5rem;
    }

    h4 {
      font-size: 1.5rem;
    }
  }
`;

export default function Posts({ posts }) {
  return (
    <Container>
      <h2>Blog</h2>
      {posts.length > 0 &&
        posts.map(
          ({ _id, title = "", slug = "", publishedAt = "", mainImage = "" }) =>
            slug && (
              <li key={_id}>
                <Link href="/posts/[slug]" as={`/posts/${slug.current}`}>
                  <a>
                    <Post>
                      {mainImage && (
                        <img
                          src={urlFor(mainImage).url()}
                          alt={mainImage.alt}
                        />
                      )}
                      <div className="postTitle">
                        {title && <h3>{title}</h3>}
                        {publishedAt && (
                          <h4>{new Date(publishedAt).toDateString()}</h4>
                        )}
                      </div>
                    </Post>
                  </a>
                </Link>
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
