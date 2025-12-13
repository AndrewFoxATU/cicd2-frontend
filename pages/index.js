import { useState, useContext } from "react";
import { useRouter } from "next/router";
import GlobalContext from "../store/globalContext";
import classes from "./index.module.css";

function AuthPage() {
  const router = useRouter();
  const { updateGlobals } = useContext(GlobalContext);

  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:8003/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: loginName,
          password: loginPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.detail || "Login failed");
        return;
      }

      updateGlobals({
        cmd: "login",
        user: result, // { id, name, permissions }
      });

      router.push("/tyres");
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }
  }

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.authCard}>
        <h1 className={classes.title}>Tyre Management Portal</h1>

        <form onSubmit={handleLogin} className={classes.form}>
          <div className={classes.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              required
            />
          </div>

          <div className={classes.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className={classes.error}>{errorMsg}</p>}

          <button className={classes.submitButton}>Login</button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
