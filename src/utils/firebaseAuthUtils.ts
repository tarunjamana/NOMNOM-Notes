
export const getFirebaseSignUpAuthErrorMessage = (errorCode : string): string => { 
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already in use. Please use a different email.';
        case 'auth/invalid-email':
            return 'The email address is not valid. Please enter a valid email.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Please contact support.';
        case 'auth/weak-password':
            return 'The password is too weak. Please choose a stronger password.';
        case 'auth/user-not-found':
            return 'No user found with this email. Please sign up first.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        default:
            return 'An unknown error occurred. Please try again later.';
    }
}

export const getFirebaseSignInAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'The email address is not valid. Please enter a valid email.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up first.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later or reset your password.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/internal-error':
            return 'Internal error. Please try again later.';
        default:
            return 'An unknown error occurred during sign-in. Please try again.';
    }
};
