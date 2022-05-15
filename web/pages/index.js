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
  height: 90vh;
`;

const Main = styled.main`
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 100vw;
    height: 100%;
    object-fit: cover;
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
    mainImage,
    description,
  }
`;

export default function Home({ data, preview }) {
  const router = useRouter();

  const { data: homepage } = usePreviewSubscription(homePageQuery, {
    params: data.homepage,
    initialData: data.homepage,
    enabled: preview && data.homepage,
  });

  if (!router.isFallback && !data.homepage) {
    return <ErrorPage statusCode={404} />;
  }

  const { title, mainImage, body, description } = homepage[0];

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

      <Main>
        {mainImage && <img src={urlFor(mainImage).url()} alt={mainImage.alt} />}
      </Main>

      {body && <PortableText value={body} />}

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

  return {
    props: {
      preview,
      // data: homepage || null,
      data: { homepage },
    },
  };
}
