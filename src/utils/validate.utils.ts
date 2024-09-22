import { toast } from 'sonner';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignup = (
	email: string,
	password: string,
	confirmPassword: string
) => {
	if (!email.length) {
		toast.error('Email is required');
		return false;
	}
	if (!emailRegex.test(email)) {
		toast.error('Invalid email format');
		return false;
	}
	if (!password.length) {
		toast.error('Password is required');
		return false;
	}
	if (password.length < 8) {
		toast.error('The password must contain at least 8 characters');
		return false;
	}
	if (password !== confirmPassword) {
		toast.error('Password and confirm password should be same');
		return false;
	}
	return true;
};

export const validateLogin = (email: string, password: string) => {
	if (!email.length) {
		toast.error('Email is required');
		return false;
	}
	if (!emailRegex.test(email)) {
		toast.error('Invalid email format');
		return false;
	}
	if (!password.length) {
		toast.error('Password is required');
		return false;
	}
	if (password.length < 8) {
		toast.error('The password must contain at least 8 characters');
		return false;
	}
	return true;
};

export const validateProfile = (firstName: string, lastName: string) => {
	if (!firstName) {
		toast.error('First Name is required');
		return false;
	}
	if (!lastName) {
		toast.error('Last Name is required');
		return false;
	}
	return true;
};
