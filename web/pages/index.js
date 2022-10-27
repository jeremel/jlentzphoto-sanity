import ErrorPage from "next/error";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { usePreviewSubscription, urlFor } from "../lib/sanity";
import { getClient } from "../lib/sanity.server";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Container = styled.div`
  width: 100%;
`;

const Header = styled.header`
  margin: 0 auto;
  height: 88vh;
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 0;

  img {
    width: 100vw;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  h1 {
    position: absolute;
    margin: 0;
    padding: 0;
    top: 33.33%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: clamp(3rem, 2.3333rem + 2.963vw, 5rem);
    letter-spacing: 0.5rem;
    font-family: century-gothic, sans-serif;
    font-weight: 700;
    font-style: normal;
    text-align: center;
  }
`;

const About = styled.section`
  padding: 1rem 1.75rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2.5rem;
  position: relative;
  background: white;
  z-index: 1;

  .about {
    width: 60vw;

    p {
      font-size: clamp(1.5rem, 1.3333rem + 0.7407vw, 2rem);
      line-height: 1.15;
      letter-spacing: 0.75px;
    }
  }

  .links {
    width: 30vw;

    p {
      margin: 0;
      padding: 0;
      font-weight: 500;
      font-size: clamp(1.65rem, 1.5083rem + 0.6296vw, 2.075rem);
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      margin: 0;
      padding-bottom: 0.25rem;
      font-size: clamp(1.45rem, 1.3833rem + 0.2963vw, 1.65rem);
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

  @media (max-width: 975px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .about {
      width: 90vw;
    }

    .links {
      width: 90vw;
    }
  }
`;

const Posts = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  background: white;

  h2 {
    margin-bottom: 1rem;
    padding: 0;
    font-size: clamp(2rem, 1.8333rem + 0.7407vw, 2.5rem);
    letter-spacing: 1.5px;
  }

  .postsContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .post {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 32.5%;
    height: 500px;
    overflow: hidden;
    border: 2px solid transparent;

    &:hover {
      border 2px solid black;
    }

    img {
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.75s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .postName {
      background: #fff;
      border: 2px solid black;
      position: absolute;
      top: 1rem;
      left: 1rem;
      transition: transform 0.5s ease;

      h3 {
        padding: clamp(0.3rem, 0.2rem + 0.4444vw, 0.6rem);
        line-height: 1;
        letter-spacing: 0.65px;
        font-size: clamp(0.9rem, 0.75rem + 0.6667vw, 1.35rem);
      }

      &:hover {
        transform: translateY(2px) translateX(5px) scale(1.025);
      }
    }

    @media (max-width: 900px) {
      width: 48%;
    }

    @media (max-width: 600px) {
      width: 95vw;
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
    "mainImgDimensions": {
      "width": mainImage.image.asset->metadata.dimensions.width,
      "height": mainImage.image.asset->metadata.dimensions.height,
    },
    description,
  }
`;

const pagesQuery = groq`
  *[_type == "page" && publishedAt < now()] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage,
    "mainImgDimensions": {
      "width": mainImage.image.asset->metadata.dimensions.width,
      "height": mainImage.image.asset->metadata.dimensions.height,
    },
  }
`;

export default function Home({ data, preview, pages }) {
  const router = useRouter();
  const pageRef = useRef(null);
  const tl = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({
          scrollTrigger: {
            trigger: ".headerSection",
            start: "top top",
            end: "bottom top",
            // end: "+=400",
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
            // markers: true,
            // id: "Pinned-Header",
          },
        })
        .to(".title", {
          // y: -2000,
          opacity: 0,
          // scrub: true,
          duration: 0.25,
        });
    }, pageRef);

    return () => ctx.revert();
  }, [tl]);

  const { data: homepage } = usePreviewSubscription(homePageQuery, {
    params: data.homepage,
    initialData: data.homepage,
    enabled: preview && data.homepage,
  });

  if (!router.isFallback && !data.homepage) {
    return <ErrorPage statusCode={404} />;
  }

  const { title, mainImage, mainImgDimensions, body, contact, description } =
    homepage[0];

  return (
    <Container id="pageWrapper" ref={pageRef}>
      <Head>
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/jl-logo.png" />
      </Head>

      <Header className="headerSection">
        {mainImage && (
          <img
            src={urlFor(mainImage.image).url()}
            alt={mainImage.alt}
            width={mainImgDimensions.width}
            height={mainImgDimensions.height}
            className="headerImage"
          />
        )}
        {title && <h1 className="title">{title}</h1>}
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
        <h2>Recent Work</h2>
        <div className="postsContainer">
          {pages.length > 0 &&
            pages.map(
              ({ _id, title, slug, mainImage, mainImgDimensions }) =>
                slug && (
                  <div className="post" key={_id}>
                    <Link href="/[slug]" as={`/${slug.current}`} passHref>
                      <a>
                        {mainImage && (
                          <img
                            src={urlFor(mainImage.image).url()}
                            alt={mainImage.alt}
                            width={mainImgDimensions.width}
                            height={mainImgDimensions.height}
                          />
                        )}
                        <div className="postName">
                          {title && <h3>{title}</h3>}
                        </div>
                      </a>
                    </Link>
                  </div>
                )
            )}
        </div>
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
    revalidate: 10,
  };
}
