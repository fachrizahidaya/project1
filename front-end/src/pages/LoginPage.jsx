import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  ColorModeProvider,
  Container,
  CSSReset,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Stack,
  useColorMode,
  ThemeProvider,
  theme,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import { Link, Navigate } from "react-router-dom";
import { FaTwitter, twitter } from "react-icons";
const url = `http://localhost:2000/users/login`;

export const LoginPage = () => {
  const usernameEmail = useRef("");
  const password = useRef("");
  const dispatch = useDispatch();
  const [move, setMove] = useState(false);

  

  const onLogin = async () => {
    try {
      const user = {
        data: usernameEmail.current.value,
        password: password.current.value,
      };
      console.log(user);
      const result = await Axios.post(url, user);
      console.log(result.data);
      dispatch(login(result.data.user));
      localStorage.setItem("token", result.data.token);
      setMove(true);
    } catch (err) {
      console.log(err);
      alert(err.response.data);
      // return (
      //   <Alert status="error">
      //     <AlertIcon />
      //   </Alert>
      // );
    }
  };

  return move ? (
    <Navigate to="/home" replace={true} />
  ) : (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Container my={8} textAlign="left">
            <Box
              borderWidth={1}
              px={4}
              textAlign="center"
              boxShadow="lg"
              borderRadius={4}
              width="full"
              maxWidth="500px"
            >
              
              <Box textAlign="right" py={4}>
                
              </Box>

              <Heading mb={2}>Login to your Account</Heading>
              <Box>
                <form>
                  <FormControl>
                    <FormLabel>Username/Email</FormLabel>
                    <Input ref={usernameEmail} />
                    <FormLabel>Password</FormLabel>
                    <Input ref={password} type="password" />
                    <Stack justifyContent="space-between" mt={4}>
                      <Box>
                        <Checkbox>Remember Me</Checkbox>
                      </Box>
                      <Box>
                        <Link>Forgot your Password?</Link>
                      </Box>
                    </Stack>
                    <Button
                      colorScheme="twitter"
                      mt={4}
                      mb={4}
                      w="100%"
                      onClick={onLogin}
                    >
                      Login
                    </Button>
                  </FormControl>
                </form>
              </Box>
            </Box>
          </Container>
        </ColorModeProvider>
      </ThemeProvider>
    </Flex>
  );
};
