import { Feather, Ionicons } from "@expo/vector-icons";
import { Reducer } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import colors from "../constants/colors";
import { signIn } from "../utils/actions/authActions";
import { validateInput } from "../utils/actions/formActions";
import { AuthResponse } from "../utils/interfaces/AuthResponse";
import { reducer } from "../utils/reducers/formReducer";
import Input from "./Input";
import SubmitButton from "./SubmitButton";

const initialState = {
  inputValues: {
    email: "",
    password: "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignInForm = (props) => {
  const dispatch = useDispatch<any>();

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
      setError("");
    }
  }, [error]);

  const authHandler = async () => {
    try {
      setIsLoading(true);
      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      dispatch(action);

      setError("");
    } catch (error) {
      if (error instanceof Error) {
        //  setError(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Input
        id="email"
        label="E-Mail"
        icon={"mail-outline"}
        iconSize={20}
        autoCapitalize="none"
        iconPack={Ionicons}
        onInputChange={inputChangedHandler}
        errorText={formState.inputValidities["email"]}
      />
      <Input
        id="password"
        label="Password"
        autoCapitalize="none"
        secureTextEntry
        icon={"lock"}
        iconSize={20}
        iconPack={Feather}
        onInputChange={inputChangedHandler}
        errorText={formState.inputValidities["password"]}
      />
      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.primary}
          style={{ marginTop: 10 }}
        />
      ) : (
        <SubmitButton
          title="Sign In"
          onPress={authHandler}
          style={{ marginTop: 20 }}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

export default SignInForm;
