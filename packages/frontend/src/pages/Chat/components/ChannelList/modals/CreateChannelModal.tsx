import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  ModalBody,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface CreateChannelModalProps {
  isOpen: boolean;
  isLoading: boolean;
  createChannel: (name: string, password: string | null) => Promise<void>;
  onClose: () => void;
}

export default function CreateChannelModal({
  isOpen,
  isLoading,
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
    if (!isLoading && hasSubmitted) {
      console.log('ggg');
      resetFormAndClose();
    }
  }, [isLoading, formik, resetFormAndClose]);

  return (
    <Modal isOpen={isOpen} onClose={resetFormAndClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create channel</ModalHeader>
        <ModalBody>
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
        </ModalBody>
        <ModalFooter display="block">
          <Flex justifyContent="end">
            <Button
              display="block"
              flex="0 1 100px"
              mr={4}
              onClick={resetFormAndClose}
            >
              Cancel
            </Button>
            <Button
              display="block"
              flex="0 1 100px"
              color="white"
              bg="#2F80ED"
              sx={{
                '&:hover': {
                  bg: '#1369DE !important',
                },
                '& > div': {
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                },
              }}
              isLoading={isLoading}
              onClick={() => formik.handleSubmit()}
            >
              Create
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
