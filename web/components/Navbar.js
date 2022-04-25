import styled from "styled-components";
import Link from "next/link";

const Container = styled.nav`
  width: 100%;
  position: sticky;
  top: 0;
  height: 10vh;
  background: white;
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 1.5rem 2.5rem;
  z-index: 1000;

  @media (max-width: 1150px) {
    padding: 1.5rem;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
  }
`;

const Nav = styled.div`
  margin: 0;
  display: flex;
  align-items: center;

  a {
    font-size: 2rem;
    color: green;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  a {
    font-size: 1.25rem;
    color: green;
  }

  @media (max-width: 1150px) {
    gap: 1rem;
  }
`;

export default function Navbar() {
  return (
    <Container>
      <Nav>
        <Link href="/" passHref>
          <a>Jereme Lentz Photography</a>
        </Link>
      </Nav>
      <NavLinks>
        <Link href="/" passHref>
          <a>Home</a>
        </Link>
        <Link href="/croatia" passHref>
          <a>Croatia</a>
        </Link>
        <Link href="/delaware-water-gap" passHref>
          <a>Delaware Water Gap</a>
        </Link>
        <Link href="/posts" passHref>
          <a>Blog</a>
        </Link>
        <Link href="/about" passHref>
          <a>About</a>
        </Link>
        <Link href="/contact" passHref>
          <a>Contact</a>
        </Link>
      </NavLinks>
    </Container>
  );
}
