import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 65vh;
`;

const Main = styled.main`
  margin: 0 auto;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    margin: 2rem auto;
    font-size: 4rem;
    color: green;
  }
`;

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Jereme Lentz Photography</title>
        <meta
          name="description"
          content="Photography by Jereme Lentz, a South Jersey based photographer"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <h1>Jereme Lentz Photography</h1>
        <h2>Some pictures</h2>
      </Main>
    </Container>
  );
}
