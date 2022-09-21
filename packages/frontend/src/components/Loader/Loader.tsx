import { PuffLoader } from 'react-spinners';

interface LoaderProps {
  size: number;
}

export default function Loader({ size }: LoaderProps) {
  return <PuffLoader color="#2F80ED" size={size} />;
}
