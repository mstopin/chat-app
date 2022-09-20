import React, { PropsWithChildren } from 'react';
import {
  chakra,
  Box,
  Text,
  FormControl as Control,
  FormLabel as Label,
  FormErrorMessage as ErrorMessage,
  Input,
  InputProps,
  Button,
  ButtonProps,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface FormProps {
  name: string;
  afterSignUp?: boolean;
  renderForm: () => React.ReactNode;
  renderFormButton: () => React.ReactNode;
  renderFormChangeText: () => React.ReactNode;
}

export function Form({
  name,
  afterSignUp,
  renderForm,
  renderFormButton,
  renderFormChangeText,
}: FormProps) {
  return (
    <Box px={16} py={10} border="1px solid #BDBDBD" borderRadius="lg">
      <Box w="300px" mx="auto">
        {afterSignUp && (
          <Box mb={8}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              textAlign="center"
            >
              <span>You have registered successfully.</span>
              <br />
              <span>You can now log in.</span>
            </Text>
          </Box>
        )}
        <Text color="secondary" fontSize="xl" fontWeight="medium">
          {name}
        </Text>
        <Box mt={6}>{renderForm()}</Box>
        <Box mt={12}>{renderFormButton()}</Box>
        <Box mt={6}>{renderFormChangeText()}</Box>
      </Box>
    </Box>
  );
}

type FormControlProps = PropsWithChildren<{
  isInvalid?: boolean;
}>;

export function FormControl({ isInvalid, children }: FormControlProps) {
  return (
    <Box mb={4}>
      <Control isInvalid={isInvalid ?? false}>{children}</Control>
    </Box>
  );
}

export function FormLabel({
  text,
  htmlFor,
}: {
  text: string;
  htmlFor: string;
}) {
  return (
    <Label fontSize="sm" fontWeight="normal" htmlFor={htmlFor}>
      {text}
    </Label>
  );
}

export function FormInput(props: InputProps) {
  return (
    <Input
      borderColor="#BDBDBD"
      focusBorderColor="#BDBDBD"
      errorBorderColor="red.500"
      {...props}
    />
  );
}

type FormButtonProps = ButtonProps & {
  text: string;
};

export function FormErrorMessage({ text }: { text: string }) {
  return <ErrorMessage color="red.500">{text}</ErrorMessage>;
}

export function FormButton({ text, ...props }: FormButtonProps) {
  return (
    <Button
      w="100%"
      bg="#2F80ED"
      color="white"
      sx={{ '&:hover': { bg: '#1369DE !important' } }}
      {...props}
    >
      {text}
    </Button>
  );
}

interface FormChangeTypeTextProps {
  text: string;
  linkText: string;
  href: string;
}

export function FormChangeTypeText({
  text,
  linkText,
  href,
}: FormChangeTypeTextProps) {
  return (
    <Text fontSize="sm" textAlign="center">
      <span>{text}</span>
      <span>&nbsp;</span>
      <Link to={href}>
        <chakra.span color="#2F80ED">{linkText}</chakra.span>
      </Link>
    </Text>
  );
}
