// pages/[slug].js
import ErrorPage from "next/error";
import Head from "next/head";
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
    body,
    mainImage,
    categories[]->{
      _id,
      title
    },
    "slug": slug.current,
    description,
  }
`;

const Container = styled.div`
  margin: 0 0 0 4rem;
  padding: 0;
  /* background: blue; */
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
      /* object-fit: cover; */
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

export default function Post({ data, preview }) {
  const router = useRouter();

  const { data: page } = usePreviewSubscription(pageQuery, {
    params: { slug: data.page?.slug },
    initialData: data.page,
    enabled: preview && data.page?.slug,
  });

  if (!router.isFallback && !data.page?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const { title, mainImage, body, description } = page;

  return (
    <Container>
      <Head>
        <title>{title} | Jereme Lentz Photography</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>{title}</h2>
      <figure>
        <img src={urlFor(mainImage).url()} alt={mainImage.alt} />
      </figure>
      <PortableText value={body} />
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
    fallback: true,
  };
}
