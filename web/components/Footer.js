import styled from "styled-components";
import Link from "next/link";

const Container = styled.div`
  width: 100%;
  padding: 1rem 0;
`;

const FooterStyles = styled.footer`
  margin: 0.15rem auto;
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  a {
    &:hover {
      color: blue;
    }
  }

  .copyright {
    font-size: 1.25rem;
  }

  .contactLinks {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    svg {
      vertical-align: middle;
      display: inline-block;
    }
  }

  @media (max-width: 500px) {
    justify-content: center;
    flex-direction: column;
  }
`;

export default function Footer() {
  return (
    <Container>
      <FooterStyles>
        <div className="copyright">
          <Link href="/">
            <a>&copy; 2022 Jereme Lentz</a>
          </Link>
        </div>

        <div className="contactLinks">
          {/* Email */}
          <a href="mailto:jerlentz@gmail.com" className="contactLink">
            <svg
              width="32"
              height="32"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 9L12 12.5L17 9"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </a>

          {/* Twitter */}
          <a
            href="https://twitter.com/jereme_l"
            target="_blank"
            rel="noreferrer"
            className="contactLink"
          >
            <svg
              width="30"
              height="30"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23 3.01006C23 3.01006 20.9821 4.20217 19.86 4.54006C19.2577 3.84757 18.4573 3.35675 17.567 3.13398C16.6767 2.91122 15.7395 2.96725 14.8821 3.29451C14.0247 3.62177 13.2884 4.20446 12.773 4.96377C12.2575 5.72309 11.9877 6.62239 12 7.54006V8.54006C10.2426 8.58562 8.50127 8.19587 6.93101 7.4055C5.36074 6.61513 4.01032 5.44869 3 4.01006C3 4.01006 -1 13.0101 8 17.0101C5.94053 18.408 3.48716 19.109 1 19.0101C10 24.0101 21 19.0101 21 7.51006C20.9991 7.23151 20.9723 6.95365 20.92 6.68006C21.9406 5.67355 23 3.01006 23 3.01006Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/jeremel/"
            target="_blank"
            rel="noreferrer"
            className="contactLink"
          >
            <svg
              width="32"
              height="32"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M17.5 6.51L17.51 6.49889"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </FooterStyles>
    </Container>
  );
}
