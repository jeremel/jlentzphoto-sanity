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

const Container = styled.div`
  margin: 0 auto;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  p {
    font-size: 1.5rem;
    width: min(95%, 55vw);
    margin: 1rem 0;
  }

  a {
    color: green;
    transition: all 0.4s ease;
  }

  a:hover,
  :focus {
    text-decoration: underline;
    text-decoration-style: wavy;
    text-decoration-color: orangered;
    text-decoration-skip-ink: none;
  }
`;

const Header = styled.header`
  position: relative;
  margin: 0;

  h2 {
    margin: 0;
    /* position: absolute; */
    color: green;
    /* left: 50%;
    top: 15%;
    transform: translate(-50%, -50%); */
    letter-spacing: 0.25rem;
    font-size: clamp(1.5rem, 0.6429rem + 4.5714vw, 3.5rem);
    text-align: center;
  }

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
`;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0 2rem;
  justify-content: center;
  align-items: center;
  max-width: 75vw;

  img {
    width: 550px;
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
    mainImage,
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
  },
};

export default function Page({ data, preview }) {
  const router = useRouter();

  const { data: page } = usePreviewSubscription(pageQuery, {
    params: { slug: data.page?.slug },
    initialData: data.page,
    enabled: preview && data.page?.slug,
  });

  if (!router.isFallback && !data.page?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const { title, mainImage, body, description, gallery } = page;

  // console.log(body);

  return (
    <Container>
      <Head>
        {title && <title>{title} | Jereme Lentz Photography</title>}
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header>
        {mainImage && (
          <figure>
            <img src={urlFor(mainImage).url()} alt={mainImage.alt} />
          </figure>
        )}

        {title && <h2>{title}</h2>}
      </Header>

      {body && <PortableText value={body} components={components} />}

      {gallery && (
        <Gallery>
          {gallery &&
            gallery.images.map((image) => (
              <img
                key={image._key}
                src={urlFor(image.asset._ref).url()}
                alt={image.alt}
              />
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
    fallback: false,
  };
}
