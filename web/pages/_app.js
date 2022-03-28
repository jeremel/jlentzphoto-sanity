import "../styles/globals.css";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";

const Content = styled.div`
  width: 100%;
  display: flex;
`;

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Content>
        <Sidebar />
        <Component {...pageProps} />
      </Content>
    </Layout>
  );
}
