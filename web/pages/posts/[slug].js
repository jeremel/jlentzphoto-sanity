// pages/posts/[slug].js
import ErrorPage from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { usePreviewSubscription, urlFor } from "../../lib/sanity";
import { getClient } from "../../lib/sanity.server";
import styled from "styled-components";

const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    body,
    mainImage,
    categories[]->{
      _id,
      title
    },
    gallery,
    "slug": slug.current,
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

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0 auto;
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

export default function Post({ data, preview }) {
  const router = useRouter();

  const { data: post } = usePreviewSubscription(postQuery, {
    params: { slug: data.post?.slug },
    initialData: data.post,
    enabled: preview && data.post?.slug,
  });

  if (!router.isFallback && !data.post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const { title, mainImage, body, gallery } = post;

  return (
    <Container>
      {title && <h2>{title}</h2>}
      {mainImage && (
        <figure>
          <img src={urlFor(mainImage).url()} />
        </figure>
      )}
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
  const post = await getClient(preview).fetch(postQuery, {
    slug: params.slug,
  });

  return {
    props: {
      preview,
      data: { post },
    },
  };
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}
