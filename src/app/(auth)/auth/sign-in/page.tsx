import AuthContainer from "@/components/auth/form/authContainer";
import SignInForm from "@/components/auth/form/signInForm";

export default async function SignInPage() {
	return (
		<AuthContainer>
			<SignInForm />
		</AuthContainer>
	);
}
