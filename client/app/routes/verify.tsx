import { initializeApp } from "firebase/app";
//import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import firebaseConfig from "~/utils/firebaseConfig";
import { serverUrl } from "~/utils/serverUrl";
import toast, { Toaster } from "react-hot-toast";
import { useUserStore } from "~/utils/stateStore";
import { useNavigate } from "react-router";

import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

const app = initializeApp(firebaseConfig);

export default function Verify() {
  const navigate = useNavigate()
  const updateUser = useUserStore((state:any) => state.updateUser)
  const [loggedIn, setLoggedIn] = useState(false);
  const [initial, setInitial] = useState(false);
  async function sendEmailToServerForSignUp(email: string | null) {
    const req = await fetch(serverUrl + "/auth/signin", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const response = await req.json();
    return response;
  }
  useEffect(() => {
    const toastOptions = { duration: 5000 };
    // Confirm the link is a sign-in with email link.
    const auth = getAuth(app);
      if (isSignInWithEmailLink(auth, window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = localStorage.getItem("emailForSignIn");

        console.log("email from localStorage:", email);
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again. For example:
          email = window.prompt("Please provide your email for confirmation");
        }
        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(auth, email, window.location.href)
          .then(async (result: any) => {
            // Clear email from storage.
            //localStorage.removeItem("emailForSignIn");

            setLoggedIn(true);
            // You can access the new user by importing getAdditionalUserInfo
            // and calling it with result:
            // getAdditionalUserInfo(result)
            // You can access the user's profile via:
            // getAdditionalUserInfo(result)?.profile
            // You can check if the user is new or existing:
            // getAdditionalUserInfo(result)?.isNewUser
          })
          .catch((error: any) => {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
            console.log(error);
          });

        sendEmailToServerForSignUp(email)
          .then((response: any) => {
            console.log(response);
            if (response.error) setLoggedIn(false);
            if (response.token)
              window.localStorage.setItem("token", response.token);
              // Update user in the userStore
              updateUser(response.user)
              navigate("/admin")
          })
          .catch((error) => {
            toast.error(error.message, toastOptions);
          });
      }
     
  });

  return (
    <>
      <Toaster />
      <p> {loggedIn ? <span className="loading loading-ball"></span> : "Oops! An error occcured!"}</p>
    </>
  );
}
