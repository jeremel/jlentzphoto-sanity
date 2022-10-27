// pages/[slug].js
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { usePreviewSubscription, urlFor } from "../lib/sanity";
import { getClient } from "../lib/sanity.server";
import styled from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const Container = styled.div`
  margin: 0 auto;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Header = styled.header`
  position: relative;
  z-index: 0;
  margin: 0;

  figure {
    margin: 0;
    height: 90vh;
    width: 100%;

    img {
      width: 100vw;
      height: 100%;
      margin: 0;
      object-fit: cover;
    }
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

const Content = styled.section`
  width: 100%;
  background: white;
  padding: clamp(1.5rem, 1.027rem + 1.0811vw, 2rem);
  position: relative;
  z-index: 1;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    background: white;
    margin: 0;
    padding: 0 1.5rem 1.5rem;
    width: 80vw;
    line-height: 1;
    letter-spacing: 0.25rem;
    font-size: clamp(2rem, 1.5rem + 2.2222vw, 3.5rem);
    text-align: center;
  }

  p {
    width: 60vw;
    font-size: clamp(1.4rem, 1.3333rem + 0.2963vw, 1.6rem);
    padding: 0;
  }

  a {
    text-decoration: underline;
    text-decoration-style: dotted;
    text-decoration-thickness: 3px;
    text-underline-offset: 4px;
  }

  @media (max-width: 700px) {
    p {
      width: 90vw;
      margin-bottom: 2rem;
    }
  }
`;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 2rem;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 1;
  background: white;
  overflow: hidden;

  .imgContainer {
    position: relative;
    overflow: hidden;
    border: 2px solid transparent;
    transition: border 0.25s ease;
    max-width: 90vw;
    max-height: 98vh;

    &: hover {
      border: 2px solid black;
    }

    img {
      height: 100%;
      width: 100%;
      transition: transform 1s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  @media (max-width: 650px) {
    .imgContainer {
      max-width: 95vw;
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

const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    titleColor,
    body[] {
      ...,
      markDefs[] {
        ...,
        _type == "internalLink" => {
          "path": "/" + reference->slug.current
        },
      },
    },
    gallery,
    "width": gallery.images[].asset->metadata.dimensions.width,
    "height": gallery.images[].asset->metadata.dimensions.height,
    mainImage,
    "mainImgDimensions": {
      "width": mainImage.image.asset->metadata.dimensions.width,
      "height": mainImage.image.asset->metadata.dimensions.height,
    },
    categories[]->{
      _id,
      title
    },
    "slug": slug.current,
    description,
  }
`;

const ImageComponent = ({ value, isInline }) => {
  return (
    <img
      src={urlFor(value).url()}
      alt={value.alt || " "}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? "inline-block" : "block",
      }}
    />
  );
};

const components = {
  types: {
    image: ImageComponent,
    // Any other custom types you have in your content
    // Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
  },
  marks: {
    internalLink: ({ value, children }) => {
      return (
        <Link href={value?.path} passHref>
          <a>{children}</a>
        </Link>
      );
    },
    link: ({ value, children }) => {
      return (
        <a href={value.href} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    },
  },
};

export default function Page({ data, preview }) {
  const router = useRouter();
  const pageRef = useRef(null);
  const tl = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({
          scrollTrigger: {
            trigger: ".pageWrapper",
            start: "top top",
            // end: "bottom top",
            end: "+=1000",
            pin: pageRef.current,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
            // markers: true,
            // id: "Pinned-Header",
          },
        })
        .to(".headerTitle", {
          // y: -800,
          opacity: 0,
          // scrub: true,
          duration: 1.25,
        });
    }, pageRef);

    return () => ctx.revert();
  }, [tl]);

  const { data: page } = usePreviewSubscription(pageQuery, {
    params: { slug: data.page?.slug },
    initialData: data.page,
    enabled: preview && data.page?.slug,
  });

  if (!router.isFallback && !data.page?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const {
    title,
    titleColor,
    mainImage,
    body,
    description,
    gallery,
    width,
    height,
    mainImgDimensions,
  } = page;

  // console.log(body);

  return (
    <Container className="pageWrapper" ref={pageRef}>
      <Head>
        {title && <title>{`${title} | Jereme Lentz Photography`}</title>}
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/jl-logo.png" />
      </Head>

      <Header className="headerSection">
        {mainImage && (
          <figure>
            <img
              src={urlFor(mainImage.image).url()}
              alt={mainImage.alt}
              width={mainImgDimensions.width}
              height={mainImgDimensions.height}
            />
          </figure>
        )}
        <Link href="/" passHref>
          <a>
            {/* <h1 className="headerTitle">Jereme Lentz</h1> */}
            <h1
              className="headerTitle"
              style={!titleColor ? { color: "black" } : { color: titleColor }}
            >
              {title}
            </h1>
          </a>
        </Link>
      </Header>

      <Content>
        {/* {title && <h2>{title}</h2>} */}
        {body && <PortableText value={body} components={components} />}
      </Content>

      {gallery && (
        <Gallery>
          {gallery &&
            gallery.images.map((image) => (
              <div className="imgContainer" key={image._key}>
                <img
                  key={image._key}
                  src={urlFor(image.asset._ref).url()}
                  alt={image.alt}
                  width={width}
                  height={height}
                  loading="lazy"
                />
              </div>
            ))}
        </Gallery>
      )}
      {preview && (
        <ExitPreview>
          <Link href="/api/exit-preview">Exit Preview</Link>
        </ExitPreview>
      )}
    </Container>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const page = await getClient(preview).fetch(pageQuery, {
    slug: params.slug,
  });

  return {
    props: {
      preview,
      data: { page },
    },
  };
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    groq`*[_type == "page" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    // fallback: false,
    fallback: "blocking",
  };
}
