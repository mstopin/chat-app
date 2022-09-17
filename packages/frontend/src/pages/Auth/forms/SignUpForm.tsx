import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Text } from '@chakra-ui/react';
import axios from 'axios';
import * as Yup from 'yup';

import {
  Form,
  FormControl,
  FormLabel,
  FormInput,
  FormButton,
  FormChangeTypeText,
  FormErrorMessage,
} from './Form';

enum SignUpState {
  SUCCESS,
  FAILED,
  EMAIL_TAKEN,
}

export default function SignUpForm() {
  const [state, setState] = useState<SignUpState | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      surname: Yup.string().required('Surname is required'),
      email: Yup.string().required('Email is required').email('Invalid email'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'At least 8 characters'),
      repeatPassword: Yup.string().required('Repeat your password'),
    }),
    validate: (values) => {
      const errors: { repeatPassword?: string } = {};

      if (values.password !== values.repeatPassword) {
        errors.repeatPassword = 'Passwords do not match';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        await axios.post('/api/users/register', {
          email: values.email,
          password: values.password,
          name: values.name,
          surname: values.surname,
        });
        setState(SignUpState.SUCCESS);
      } catch (e: any) {
        if (
          e.response.data.statusCode === 400 &&
          e.response.data.message === 'User already exists'
        ) {
          setState(SignUpState.EMAIL_TAKEN);
        } else {
          setState(SignUpState.FAILED);
        }
      }
    },
  });

  useEffect(() => {
    if (state === SignUpState.SUCCESS) {
      navigate('/auth/login?registered=true');
    }
  }, [state, navigate]);

  const isFormInvalid = (
    name: 'name' | 'surname' | 'email' | 'password' | 'repeatPassword'
  ) => {
    return !!formik.touched[name] && !!formik.errors[name];
  };

  return (
    <Form
      name="Sign Up"
      renderForm={() => (
        <>
          <FormControl isInvalid={isFormInvalid('name')}>
            <FormLabel text="Name:" htmlFor="name" />
            <FormInput type="text" {...formik.getFieldProps('name')} />
            {!!formik.errors.name && (
              <FormErrorMessage text={formik.errors.name} />
            )}
          </FormControl>
          <FormControl isInvalid={isFormInvalid('surname')}>
            <FormLabel text="Surname:" htmlFor="surname" />
            <FormInput type="text" {...formik.getFieldProps('surname')} />
            {!!formik.errors.surname && (
              <FormErrorMessage text={formik.errors.surname} />
            )}
          </FormControl>
          <FormControl isInvalid={isFormInvalid('email')}>
            <FormLabel text="Email:" htmlFor="email" />
            <FormInput type="email" {...formik.getFieldProps('email')} />
            {!!formik.errors.email && (
              <FormErrorMessage text={formik.errors.email} />
            )}
          </FormControl>
          <FormControl isInvalid={isFormInvalid('password')}>
            <FormLabel text="Password:" htmlFor="password" />
            <FormInput type="password" {...formik.getFieldProps('password')} />
            {!!formik.errors.password && (
              <FormErrorMessage text={formik.errors.password} />
            )}
          </FormControl>
          <FormControl isInvalid={isFormInvalid('repeatPassword')}>
            <FormLabel text="Repeat password:" htmlFor="repeatPassword" />
            <FormInput
              type="password"
              {...formik.getFieldProps('repeatPassword')}
            />
            {!!formik.errors.repeatPassword && (
              <FormErrorMessage text={formik.errors.repeatPassword} />
            )}
          </FormControl>
          {(state === SignUpState.EMAIL_TAKEN ||
            state === SignUpState.FAILED) && (
            <Text
              fontSize="sm"
              textAlign="center"
              fontWeight="bold"
              color="red.500"
              mb={-6}
            >
              {state === SignUpState.EMAIL_TAKEN && (
                <span>Email is already taken.</span>
              )}
              {state === SignUpState.FAILED && (
                <>
                  <span>Could not sign up right now.</span>
                  <span>Try again later.</span>
                </>
              )}
            </Text>
          )}
        </>
      )}
      renderFormButton={() => (
        <FormButton text="Sign up" onClick={() => formik.handleSubmit()} />
      )}
      renderFormChangeText={() => (
        <FormChangeTypeText
          text="Already a user?"
          linkText="LOG IN"
          href="/auth/login"
        />
      )}
    />
  );
}
