import React, { useState } from "react";
import { StyleSheet, View, Modal } from "react-native";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { emailValidator } from "../helpers/emailValidator";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [modalEmailOpen, setModalEmailOpen] = useState(false);
  const [modalLogOpen, setModalLogOpen] = useState(false);
  const [verifNum, setVerification] = useState();
  const [verifPW, setVerificationPW] = useState("");
  const [newPass, setNewPass] = useState({ pw: "", confPW: "" });

  const resendVerif = () => {
    console.log("resend code to email");
  };

  const submitVerif = () => {
    console.log("new pw set and close modal");
    setModalEmailOpen(false);
    setModalLogOpen(false);
  };
  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    navigation.navigate("Login");
  };

  return (
    <Background>
      <View>
        {/* email code verification modal*/}
        <Modal visible={modalEmailOpen} animationType="slide">
          <View>
            <TextInput
              style={styles.TextInput}
              placeholder="Enter the verification code sent to your email"
              onChangeText={(number) => {
                setVerification(number);
              }}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.TextInput}
              placeholder="Enter new password"
              onChangeText={(pw) => {
                setNewPass({ pw: pw, confPW: newPass.confPW });
              }}
            />

            <TextInput
              style={styles.TextInput}
              placeholder="Confirm new Password"
              onChangeText={(confpw) => {
                setNewPass({ pw: newPass.pw, confPW: confpw });
              }}
            />

            <Button
              //style={styles.button}
              title="Resend Verification Code"
              color="blue"
              onPress={() => resendVerif()}
            />
            <Button
              //style={styles.button}
              title="Submit"
              color="maroon"
              onPress={() => submitVerif()}
            />
          </View>
        </Modal>

        {/* already loged in pw change verification modal*/}
        <Modal visible={modalLogOpen} animationType="slide">
          <View>
            <TextInput
              style={styles.TextInput}
              placeholder="Enter you current password"
              onChangeText={(pw) => {
                setVerificationPW(pw);
              }}
            />

            <TextInput
              style={styles.TextInput}
              placeholder="Enter new password"
              onChangeText={(pw) => {
                setNewPass({ pw: pw, confPW: newPass.confPW });
              }}
            />

            <TextInput
              style={styles.TextInput}
              placeholder="Confirm new Password"
              onChangeText={(confpw) => {
                setNewPass({ pw: newPass.pw, confPW: confpw });
              }}
            />

            <Button
              //style={styles.button}
              title="Submit"
              color="maroon"
              onPress={() => submitVerif()}
            />
          </View>
        </Modal>

        <BackButton goBack={navigation.goBack} />
        <Logo />
        <Header>Restore Password</Header>
        <TextInput
          label="E-mail address"
          returnKeyType="done"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          description="You will receive email with password reset code."
        />
        <Button
          mode="contained"
          onPress={sendResetPasswordEmail}
          style={{ marginTop: 16 }}
        >
          Send Instructions
        </Button>
      </View>
    </Background>
  );
}
const styles = StyleSheet.create({
  TextInput: {
    paddingBottom: 10,
    backgroundColor: "grey",
    color: "white",
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },

  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
