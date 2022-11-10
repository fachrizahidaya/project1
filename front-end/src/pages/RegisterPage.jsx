import React from "react";
import {
  Box,
  ChakraProvider,
  Container,
  theme,
  Text,
  Input,
  VStack,
  Button,
  InputGroup,
  Alert,
  AlertIcon,
  FormLabel,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import Axios from "axios";
const url = `http://localhost:2000/users/register`;

export const RegisterPage = () => {
  const [show, setShow] = useState(false);
  // const handleClick = () => setShow(!show);

  const registerSchema = Yup.object().shape({
    username: Yup.string().required("required field"),
    email: Yup.string().required("required field"),
    phoneNumber: Yup.string().required("required field"),
    password: Yup.string()
      .required("required field")
      .min(8, "minimum 8 characters"),
    confirmPassword: Yup.string().required(),
  });
  const onRegister = async (data) => {
    try {
      const result = await Axios.post(url, data);
      console.log(result);
      // alert(result.data);
      return (
        <Alert status="success">
          <AlertIcon />
          Process Success
        </Alert>
      );
    } catch (err) {
      console.log(err);
      // alert(err.response.data);
      return (
        <Alert status="error">
          <AlertIcon />
          Process Failed
        </Alert>
      );
    }
  };

  const AlertComp = () => {
    return (
      <Alert show="false" status="success">
        <AlertIcon />
        Register Success
      </Alert>
    );
  };

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          username: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={registerSchema}
        onSubmit={(values, action) => {
          console.log(values);
          onRegister(values);
          // action.setFieldValue("email", "");
          // action.setFieldValue("username", "");
          // action.setFieldValue("password", "");
          // action.setFieldValue("confirmPassword", "");
          // action.setFieldValue("phoneNumber", "");
        }}
      >
        {(props) => {
          console.log(props);
          return (
            <>
              {show ? <AlertComp /> : null}
              <Container
                justifyContent="space-between"
                display="flex"
                w="-webkit-max-content"
                alignContent=""
              >
                <Container>
                  <ChakraProvider theme={theme}>
                    <Box borderWidth="1px" borderRadius="lg" p={4} mt={3}>
                      <Text fontSize="2xl" align="center">
                        Create Account
                      </Text>
                      <Text fontSize="md" align="center" pb={4}>
                        Already have account?
                        <Link type="solid" color="salmon" to="/login">
                          Login here
                        </Link>
                      </Text>
                      <VStack spacing={2} align="stretch" pb={3}>
                        <Form>
                          <FormLabel>Username</FormLabel>
                          <Input
                            as={Field}
                            name="username"
                            placeholder="Username"
                          />
                          <ErrorMessage
                            name="username"
                            component="div"
                            style={{ color: "red" }}
                          ></ErrorMessage>
                          <FormLabel>Email</FormLabel>
                          <Input as={Field} name="email" placeholder="Email" />
                          <ErrorMessage
                            name="email"
                            component="div"
                            style={{ color: "red" }}
                          ></ErrorMessage>
                          <FormLabel>Phone Number</FormLabel>
                          <Input
                            as={Field}
                            name="phoneNumber"
                            placeholder="Phone Number"
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            style={{ color: "red" }}
                          ></ErrorMessage>
                          <FormLabel>Password</FormLabel>

                          <Input
                            placeholder="Password"
                            name="password"
                            as={Field}
                            type="password"
                          />

                          <ErrorMessage
                            name="password"
                            component="div"
                            style={{ color: "red" }}
                          ></ErrorMessage>
                          <FormLabel>Confirm Password</FormLabel>

                          <Input
                            placeholder="Confirm Password"
                            as={Field}
                            name="confirmPassword"
                            type="password"
                          />
                          <Button
                            colorScheme="teal"
                            variant="solid"
                            isFullWidth="true"
                            borderRadius="lg"
                            type="submit"
                            mt={2}
                            w="100%"
                          >
                            Create Account
                          </Button>
                        </Form>
                      </VStack>
                    </Box>
                  </ChakraProvider>
                </Container>
              </Container>
            </>
          );
        }}
      </Formik>
    </div>
  );
};
