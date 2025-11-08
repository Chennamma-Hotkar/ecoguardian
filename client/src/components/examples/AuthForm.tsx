import AuthForm from '../AuthForm';

export default function AuthFormExample() {
  return <AuthForm onAuthSuccess={(user) => console.log('User authenticated:', user)} />;
}
