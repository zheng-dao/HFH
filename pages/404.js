import { useRouter } from 'next/router';

export default function PageNotFoundPage() {
  const router = useRouter();

  router.replace('/');

  return null;
}
