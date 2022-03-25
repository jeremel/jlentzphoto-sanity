import Link from "next/link";
import styled from "styled-components";

const Container = styled.div`
  width: 25vw;
  /* background: black; */
  position: sticky;
  top: 20vh;
  align-self: start;
`;

const Aside = styled.aside`
  margin: 0 auto;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  a {
    margin: 1rem 0 0 1.25rem;
    font-size: 1.5rem;
    font-weight: 500;
    color: green;
  }
`;

export default function Sidebar() {
  return (
    <Container>
      <Aside>
        <Link href="/" passHref>
          <a>Home</a>
        </Link>
        <Link href="/croatia" passHref>
          <a>Croatia</a>
        </Link>
        <Link href="/about" passHref>
          <a>About</a>
        </Link>
        <Link href="/contact" passHref>
          <a>Contact</a>
        </Link>
      </Aside>
    </Container>
  );
}
