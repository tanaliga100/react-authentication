import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const [newpass, setNewPass] = useState("");
  const authCtx = useContext(AuthContext);
  const history = useHistory()

  const submitHandler = (e) => {
    e.preventDefault();

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD_gCtFP3K7JVdqSBsX-OvKhkI_2mcC5vM",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: newpass,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      return res.json()
    }).then(data => {
      alert("PASSWORD CHANGED")
      console.log(data);
      history.replace('/')
    })
    setNewPass("");
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          onChange={(e) => setNewPass(e.currentTarget.value)}
          value={newpass}
          minLength="5"
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
