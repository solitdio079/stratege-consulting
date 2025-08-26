import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
//import { getMessaging, getToken, onMessage } from "firebase/messaging";
import firebaseConfig from "~/utils/firebaseConfig";
import { redirect, useNavigate } from "react-router";
import { useUserStore } from "~/utils/stateStore";
import { useEffect } from "react";

const app = initializeApp(firebaseConfig);

export default function Logout(){
  const updateUser = useUserStore((state:any) => state.updateUser)
  const navigate = useNavigate()
  useEffect(() => {
    const logoutAndRedirect = async () => {
      try {
        localStorage.removeItem("token");
        const auth = getAuth(app);
        await signOut(auth);
        console.log("Firebase signed out");
  
        updateUser({});
        //posthog.capture("logout")
  
        // Delay navigation to allow Zustand to sync localStorage
        setTimeout(() => navigate("/login"), 0);
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
  
    logoutAndRedirect();
  }, []);
  
  return(<>
   <div className="h-screen flex items-center justify-center">
    <span className="loading loading-spinner text-primary"></span>
    <p className="ml-2">Déconnexion...</p>
  </div>
  </>)

}