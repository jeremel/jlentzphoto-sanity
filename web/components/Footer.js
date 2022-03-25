import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const FooterStyles = styled.footer`
  margin: 0 auto;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    margin: 2rem auto;
    font-size: 1.5rem;
    color: green;
  }
`;

export default function Footer() {
  return (
    <Container>
      <FooterStyles>
        <p>&copy; 2022 Jereme Lentz :)</p>
      </FooterStyles>
    </Container>
  );
}
