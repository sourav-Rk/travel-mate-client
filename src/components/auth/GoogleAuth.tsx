import {GoogleLogin,GoogleOAuthProvider} from "@react-oauth/google"
import type {CredentialResponse} from "@react-oauth/google"


interface GoogleAuthProps {
    handleGoogleSuccess : (credentialResponse : CredentialResponse) => void;
}

const GoogleAuth : React.FC<GoogleAuthProps> = ({handleGoogleSuccess}) =>{
    const clientId : string = import.meta.env.VITE_GOOGLE_CLIENT_ID;
 
    return(
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
                console.log("Login Failed");
            }}
            useOneTap
            type="standard"
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            logo_alignment="center"
            locale="en"
            />

        </GoogleOAuthProvider>
    )

}

export default GoogleAuth