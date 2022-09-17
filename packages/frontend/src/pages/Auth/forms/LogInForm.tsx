import { useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useUserStore } from '../../../hooks/useUserStore';

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
  const logIn = useUserStore((state) => state.logIn);

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
      await logIn(email, password);
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
        <FormButton text="Log In" onClick={() => formik.handleSubmit()} />
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
