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

const Container = styled.div`
  margin: 0 0 0 4rem;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 3rem;
    margin: 0 0 1rem 0;
  }

  figure {
    height: 55vh;
    margin: 0;

    img {
      height: 100%;
    }
  }

  p {
    font-size: 1.5rem;
    max-width: 50vw;
    margin: 1rem 0;
  }

  a {
    color: green;
    transition: all 0.4s ease;
  }

  a:hover,
  :focus {
    text-decoration: underline;
  }
`;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  img {
    width: 500px;
  }
`;

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
        <title>{title} | Jereme Lentz Photography</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {title && <h2>{title}</h2>}
      {mainImage && (
        <figure>
          <img src={urlFor(mainImage).url()} alt={mainImage.alt} />
        </figure>
      )}

      <PortableText value={body} components={components} />

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
      {preview && <Link href="/api/exit-preview">Preview Mode Activated!</Link>}
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
