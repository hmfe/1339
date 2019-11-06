import React from 'react';

// Style
import styled from "styled-components";
import {ThemeProvider} from 'styled-components';
import {THEME_SETTINGS} from "./styles/theme";

// Components
import { SearchForm } from "./components/SearchForm/SearchForm";
import {Layout} from "./components/Layout";

const App = () => {
  return (
      <ThemeProvider theme={THEME_SETTINGS}>
          <Layout>
             <Title>Search by title!</Title>
            <SearchForm />
          </Layout>
      </ThemeProvider>
  );
};

export default App;

const Title = styled.h1`
  margin:0 auto 1rem;
  padding: 4rem 1rem 0;
  font-size: 1.875rem;
  line-height:1.44;
  font-family: ${props => props.theme.primaryFont};
  max-width: 36rem;
`;
