import styled from "styled-components";
import Link from "next/link";

const Container = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  height: 20vh;
  background: white;
`;

const Nav = styled.nav`
  margin: 0 auto;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    margin: 2rem auto;
    font-size: 4rem;
    color: green;
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
    </Container>
  );
}
