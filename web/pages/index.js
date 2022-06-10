import ErrorPage from "next/error";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { usePreviewSubscription, urlFor } from "../lib/sanity";
import { getClient } from "../lib/sanity.server";

const Container = styled.div`
  width: 100%;
  /* height: 90vh; */
`;

const Header = styled.header`
  margin: 0 auto;
  height: 88vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  img {
    width: 100vw;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }

  h1 {
    position: absolute;
    margin: 0;
    padding: 0;
    top: 33.33%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    letter-spacing: 0.5rem;
  }
`;

const About = styled.section`
  padding: 1rem 1.75rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2.5rem;

  .about {
    width: 60vw;

    p {
      font-size: 2rem;
      line-height: 1.15;
      letter-spacing: 0.75px;
    }
  }

  .links {
    width: 30vw;

    p {
      margin: 0;
      padding: 0;
      font-size: 2.5vw;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      margin: 0;
      padding-bottom: 0.25rem;
      font-size: 2vw;
      transition: transform 0.5s ease;

      &:hover {
        list-style: circle;
        transform: translateX(1rem);
      }
    }

    li a:hover {
      color: blue;
    }
  }
`;

const Posts = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    margin-bottom: 1rem;
    padding: 0;
  }

  .post {
    position: relative;

    li {
      list-style: none;
    }

    .postName {
      background: #fff;
      border: 4px solid black;
      position: absolute;
      top: 1rem;
      left: 1rem;
      box-shadow: var(--box-shadow);
      transition: transform 0.5s ease;

      h3 {
        padding: clamp(0.3rem, 0.2rem + 0.4444vw, 0.6rem);
        line-height: 1;
        font-size: clamp(0.9rem, 0.75rem + 0.6667vw, 1.35rem);
      }

      &:hover {
        transform: translateY(2px) translateX(5px) scale(1.025);
      }
    }
  }
`;

const ExitPreview = styled.div`
  position: fixed;
  left: 25px;
  bottom: 25px;
  background: darkcyan;
  padding: 0.5rem;
  border-radius: 5px;
  box-shadow: 2.2px 4.3px 4.3px hsl(0deg 0% 0% / 0.43);

  a {
    color: white;
    font-size: 1rem;
  }
`;

const homePageQuery = groq`
  *[_type == "homepage"]{
    _id,
    title,
    body,
    contact,
    mainImage,
    description,
  }
`;

const pagesQuery = groq`
  *[_type == "page" && publishedAt < now()] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
  }
`;

export default function Home({ data, preview, pages }) {
  const router = useRouter();

  const { data: homepage } = usePreviewSubscription(homePageQuery, {
    params: data.homepage,
    initialData: data.homepage,
    enabled: preview && data.homepage,
  });

  if (!router.isFallback && !data.homepage) {
    return <ErrorPage statusCode={404} />;
  }

  const { title, mainImage, body, contact, description } = homepage[0];

  return (
    <Container>
      <Head>
        {title && <title>{title}</title>}
        {description && (
          <meta
            name="description"
            content="Photography by Jereme Lentz, a South Jersey based photographer"
          />
        )}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header>
        {mainImage && (
          <img src={urlFor(mainImage.image).url()} alt={mainImage.alt} />
        )}
        {title && <h1>{title}</h1>}
      </Header>

      <About>
        {body && (
          <div className="about">
            <PortableText value={body} />
          </div>
        )}
        {contact && (
          <div className="links">
            <PortableText value={contact} />
          </div>
        )}
      </About>

      <Posts>
        <h2>Most Recent Work</h2>
        {pages.length > 0 &&
          pages.map(
            ({ _id, title, slug, mainImage }) =>
              slug && (
                <div className="post">
                  <li key={_id}>
                    <Link href="/[slug]" as={`/${slug.current}`}>
                      <a>
                        {mainImage && (
                          <img
                            src={urlFor(mainImage.image).url()}
                            alt={mainImage.alt}
                          />
                        )}
                        <div className="postName">
                          {title && <h3>{title}</h3>}
                        </div>
                      </a>
                    </Link>
                  </li>
                </div>
              )
          )}
      </Posts>

      {preview && (
        <ExitPreview>
          <Link href="/api/exit-preview">Exit Preview</Link>
        </ExitPreview>
      )}
    </Container>
  );
}

export async function getStaticProps({ preview = false }) {
  let homepage = await getClient(preview).fetch(homePageQuery);
  let pages = await getClient().fetch(pagesQuery);

  return {
    props: {
      preview,
      // data: homepage || null,
      data: { homepage },
      pages,
    },
  };
}
