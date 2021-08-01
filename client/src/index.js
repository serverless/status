import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Link as RouterLink } from 'react-router-dom';
import theme from './theme'
import { ChakraProvider, ColorModeScript, Button, Box, Container, HStack, Link, Heading, } from "@chakra-ui/react"
import { PrivateRoute } from './PrivateRoute'

import reportWebVitals from './reportWebVitals';
import { Home } from './Home';



const App = () => {
  const logout = () => {
    localStorage.removeItem("serverless-status");
    window.location.reload();
  }
  return (
    <Switch>
      <Box minHeight="100vh">
        <Box
          p={5}
          borderBottomWidth="1px"
        >
          <Container maxW="container.lg">

            <HStack spacing="54px">
              <Link as={RouterLink} to="/">
                <Heading as="h5" size="md">Services</Heading>
              </Link>
              <Link as={RouterLink} to="/incidents">
                <Heading as="h5" size="md">Incidents</Heading>
              </Link>
              <Button onClick={logout}>
                Logout
              </Button>
            </HStack>
          </Container>
        </Box>
        <Container maxW="container.lg">
          <PrivateRoute path="/" exact component={Home} />
          
        </Container>
      </Box>
    </Switch>
  )
}


ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />

    <ChakraProvider theme={theme}>


      <BrowserRouter>

        <App />

      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
