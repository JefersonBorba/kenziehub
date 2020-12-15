import { FormContainer, Form } from "./style";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAutoFillEmail,
  addAutoFillPswd,
} from "../../store/modules/autoFill/actions";
import { useForm } from "react-hook-form";
import { loginThunk } from "../../store/modules/user/thunk";
import { getTokenThunk } from "../../store/modules/token/thunk";
import LoginLogo from "../../img/user_group_1.svg";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const autoFillPswd = useSelector((state) => state.autoFillPswd);
  const autoFillEmail = useSelector((state) => state.autoFillEmail);
  const [width, setWidth] = useState()
  const {
    register,
    unregister,
    setValue,
    errors,
    handleSubmit,
    setError,
  } = useForm();

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    };
    window.addEventListener('resize', handleResize);

    register("email", { required: "O campo de email não pode estar vazio" });
    register("password", { required: "O campo de senha não pode estar vazio" });

    return () => {
      unregister("email");
      unregister("password");
      window.removeEventListener('resize', handleResize)
    };
  }, [register, unregister, width]);

  const tryLogin = (data) => {
    axios
      .post("https://kenziehub.me/sessions", { ...data })
      .then((res) => {
        dispatch(loginThunk(res.data.user));
        dispatch(getTokenThunk(res.data.token));
        history.push("/");
      })
      .catch((err) =>
        setError("password", { message: "Email ou senha inválido" })
      );
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <FormContainer >
        <form
          onSubmit={handleSubmit(tryLogin)}
          style={{ width: "60%" }}
          noValidate
          autoComplete="off"
        >
          <Form>
            <TextField
              value={autoFillEmail}
              onChange={(e) => {
                dispatch(addAutoFillEmail(e.target.value));
                setValue("email", e.target.value);
              }}
              label="Email"
              variant="outlined"
              fullWidth
            />
            <TextField
              value={autoFillPswd}
              type="password"
              onChange={(e) => {
                dispatch(addAutoFillPswd(e.target.value));
                setValue("password", e.target.value);
              }}
              label="Password"
              variant="outlined"
              fullWidth
            />
            <Button
              className="loginButton"
              type="submit"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
            {errors.email && <p>{errors.email.message}</p>}
            {errors.password && <p>{errors.password.message}</p>}
          </Form>
        </form>
        <Button
          className="signupButton"
          variant="contained"
          color="primary"
          onClick={() => {
            history.push("/sign-up");
          }}
        >
          Cadastre-se
        </Button>
      </FormContainer>
      {width > 800 && <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          textAlign: "center",
        }}
      >
            <h1>KENZIE HUB</h1>
            <img alt="placeholder" src={LoginLogo} style={{ width: "60%" }} />
      </div>}
    </div>
  );
};

export default Login;
