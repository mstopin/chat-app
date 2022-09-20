import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Text } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { useUser } from '../../../hooks/useUser';
import { User } from '../../../types';

import {
  Form,
  FormControl,
  FormLabel,
  FormInput,
  FormErrorMessage,
  FormButton,
  FormChangeTypeText,
} from './Form';

export default function LogInForm() {
  const [searchParams] = useSearchParams();
  const { setUser } = useUser();
  const [loginError, setLoginError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email is required').email('Invalid email'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async ({ email, password }) => {
      try {
        const response = await axios.post('/api/auth/login', {
          email,
          password,
        });
        setUser(response.data as User);
      } catch (e: any) {
        if (e.response.data.statusCode === 401) {
          setLoginError('Invalid email or password');
        } else {
          setLoginError('Could not log in. Try again later.');
        }
      }
    },
  });

  return (
    <Form
      name="Log In"
      afterSignUp={searchParams.has('registered')}
      renderForm={() => (
        <>
          <FormControl
            isInvalid={!!formik.touched.email && !!formik.errors.email}
          >
            <FormLabel text="Email:" htmlFor="email" />
            <FormInput type="email" {...formik.getFieldProps('email')} />
            {!!formik.errors.email && (
              <FormErrorMessage text={formik.errors.email} />
            )}
          </FormControl>
          <FormControl
            isInvalid={!!formik.touched.password && !!formik.errors.password}
          >
            <FormLabel text="Password:" htmlFor="password" />
            <FormInput type="password" {...formik.getFieldProps('password')} />
            {formik.errors.password && (
              <FormErrorMessage text={formik.errors.password} />
            )}
          </FormControl>
        </>
      )}
      renderFormButton={() => (
        <>
          <FormButton
            text="Log In"
            onClick={() => formik.handleSubmit()}
            isLoading={formik.isSubmitting}
          />
          {!!loginError && (
            <Text mt={4} color="red.500" textAlign="center" fontWeight="bold">
              {loginError}
            </Text>
          )}
        </>
      )}
      renderFormChangeText={() => (
        <FormChangeTypeText
          text="Need an account?"
          linkText="SIGN UP"
          href="/auth/signup"
        />
      )}
    />
  );
}
