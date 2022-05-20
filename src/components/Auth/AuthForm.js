import { useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";


import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setIsLoading] = useState(false)
  const history = useHistory()

  const authCtx = useContext(AuthContext)

  const emailRef = useRef();
  const passwordRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    
    // optional: validations
    setIsLoading(true)

    if (isLogin) {
      fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD_gCtFP3K7JVdqSBsX-OvKhkI_2mcC5vM", {
        method: "POST",
        headers: {
          'Content-Type':  'application/json'
        },
        body: JSON.stringify( {
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        })
      }).then(res => {
        setIsLoading(false)
        if(res.ok) {
          alert('LOGIN SUCCESS')
          return res.json();
          
        }else {
          return res.json().then(data => {
            console.log(data);
            if(data && data.error && data.error.message){
              alert(data.error.message)
            }
          })
        }
      }).then(data => {
        console.log(data);
        const expirationTime = new Date((new Date().getTime() + (+data.expiresIn * 1000)))
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace('/profile')

      })
      
    } else {
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD_gCtFP3K7JVdqSBsX-OvKhkI_2mcC5vM",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: false,
          }),
        }
      ).then((response) => {
      setIsLoading(false)

        if(response.ok) {
          alert("NEW ACCOUNT CREATED")
          return response.json()
        }else {
          return response.json().then(data => {
            console.log(data);
            let errorMessage = "Authentication Failed"
            if(data && data.error && data.error.message){
              errorMessage = data.error.message
            }
            alert(errorMessage)
          })
        }
      }).then(data => {
        console.log(data);
        authCtx.login(data.idToken);

      })
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordRef} />
        </div>
        <div className={classes.actions}>
          {!loading && <button>{isLogin ? "Login" : "Create Account"}</button>}
          {loading && <p className={classes.notice}> sending requests...</p>}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
