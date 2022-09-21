import { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  Modal,
  ModalButton,
  ModalPrimaryButton,
  ModalButtonContainer,
} from '../../../../../components/Modal';

interface CreateChannelModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  createChannel: (name: string, password: string | null) => Promise<void>;
  onClose: () => void;
}

export default function CreateChannelModal({
  isOpen,
  isLoading,
  error,
  createChannel,
  onClose,
}: CreateChannelModalProps) {
  const [hasSubmitted, setSubmitted] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      password: Yup.string().min(8, 'Password is at least 8 characters'),
    }),
    onSubmit: ({ name, password }) => {
      setSubmitted(true);
      createChannel(name, password.length ? password : null);
    },
  });

  const resetFormAndClose = () => {
    if (!isLoading) {
      formik.resetForm();
      setSubmitted(false);
      onClose();
    }
  };

  useEffect(() => {
    if (!isLoading && !error && hasSubmitted) {
      resetFormAndClose();
    }
  }, [isLoading, formik, resetFormAndClose]);

  return (
    <Modal
      title="Create channel"
      isOpen={isOpen}
      onClose={resetFormAndClose}
      renderBody={() => (
        <>
          <FormControl
            isInvalid={!!formik.touched.name && !!formik.errors.name}
          >
            <FormLabel>Name:</FormLabel>
            <Input
              type="text"
              placeholder="Name"
              {...formik.getFieldProps('name')}
            />
            {<FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
          </FormControl>
          <FormControl
            mt={4}
            isInvalid={!!formik.touched.password && !!formik.errors.password}
          >
            <FormLabel>Password (optional):</FormLabel>
            <Input
              type="password"
              placeholder="Password (optional)"
              {...formik.getFieldProps('password')}
            />
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>
          {!!error && (
            <Text mt={2} color="red.500" fontWeight="bold">
              {error}
            </Text>
          )}
        </>
      )}
      renderFooter={() => (
        <ModalButtonContainer>
          <ModalButton text="Cancel" onClick={resetFormAndClose} />
          <ModalPrimaryButton
            text="Create"
            isLoading={isLoading}
            onClick={() => formik.handleSubmit()}
          />
        </ModalButtonContainer>
      )}
    />
  );
}
