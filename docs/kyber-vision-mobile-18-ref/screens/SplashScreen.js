import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import TemplateView from "./subcomponents/TemplateView";
import ButtonKvStd from "./subcomponents/buttons/ButtonKvStd";
import ButtonKvImage from "./subcomponents/buttons/ButtonKvImage";
// import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "../reducers/user";
import guestUserData from "../offlineData/userReducer.json";
import { useSelector } from "react-redux";
export default function SplashScreen({ navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.user);
  const teamReducer = useSelector((state) => state.team);
  const handleLoginGuestOffline = () => {
    console.log("Guest login");

    dispatch(
      loginUser({
        email: guestUserData.user.email,
        token: guestUserData.token,
        username: guestUserData.user.username,
      })
    );
    navigation.navigate("SelectTeamScreen");
  };

  useEffect(() => {
    if (userReducer.token) {
      navigation.navigate("SelectTeamScreen");
    }
  }, [userReducer.token]);

  return (
    <TemplateView>
      <View style={styles.container}>
        {/* -------- TOP ----- */}
        <View style={styles.containerTop}>
          {/* <Text>token: {userReducer.token}</Text> */}
          <View style={styles.vwEmailButtons}>
            <ButtonKvStd
              title="Register"
              onPress={() => {
                // console.log("Register");
                navigation.navigate("RegisterScreen");
              }}
              style={styles.btnEmailRegister}
            >
              Email Register
            </ButtonKvStd>
            <ButtonKvStd
              title="Login"
              onPress={() => {
                // console.log("Register");
                if (userReducer.token) {
                  navigation.navigate("SelectTeamScreen");
                } else {
                  navigation.navigate("LoginScreen");
                }
              }}
              style={styles.btnEmailLogin}
            >
              {userReducer.token ? "Select Squad" : "Email Login"}
            </ButtonKvStd>
            {userReducer.token && (
              <ButtonKvStd
                title="Logout"
                onPress={() => {
                  dispatch(logoutUser());
                }}
                style={styles.btnEmailLogin}
              >
                Logout
              </ButtonKvStd>
            )}
          </View>
          <View style={styles.vwLineContainer}>
            <View style={styles.vwLine} />
          </View>
          <View style={styles.vwOr}>
            <Text>or</Text>
          </View>
          <View style={styles.vwSocials}>
            <ButtonKvImage
              title="Google"
              //   onPress={handleGoogleSignIn}
              style={styles.btnGoogle}
              disabled={isSubmitting}
            >
              <Image source={require("../assets/images/btnGoogle.png")} />
            </ButtonKvImage>
          </View>
          <View style={styles.vwLineContainer}>
            <View style={styles.vwLine} />
          </View>
        </View>
        <View style={styles.containerBottom}>
          <ButtonKvStd
            title="Guest signin"
            onPress={() => {
              console.log("Login");
              // navigation.navigate("Login")
              handleLoginGuestOffline();
            }}
            style={styles.btnContinueWithoutLogin}
          >
            continue without login
          </ButtonKvStd>
          <Text style={{ position: "absolute", bottom: 20, right: 30 }}>
            Version 0.18.3
          </Text>
        </View>
      </View>
    </TemplateView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFD",
  },

  // ----- TOP -----
  containerTop: {
    flex: 1,
  },
  vwEmailButtons: {
    width: "100%",
    // height: 170,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: "10%",
  },
  btnEmailRegister: {
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#806181",
    fontSize: 24,
    height: 50,
    justifyContent: "center",
  },
  btnEmailLogin: {
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "white",
    color: "#585858",
    fontSize: 24,
    borderColor: "#585858",
    borderWidth: 2,
    borderStyle: "solid",
    padding: 5,
    height: 50,
    justifyContent: "center",
  },

  vwLineContainer: {
    width: Dimensions.get("window").width,
    alignItems: "center",
  },
  vwLine: {
    width: "80%",
    borderColor: "#A3A3A3",
    borderWidth: 1,
    borderStyle: "solid",
  },
  vwOr: {
    width: Dimensions.get("window").width,
    alignItems: "center",
  },
  vwSocials: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    // height: 100,
    // backgroundColor: "gray",
  },
  containerBottom: {
    // height: 500,
    width: Dimensions.get("window").width,
    // flex: 1,
    height: 150,
    // backgroundColor: "gray",
    // borderWidth: 2, // Adjust thickness as needed
    // borderColor: "gray", // Change color as desired
    // borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: 50,
  },
  btnContinueWithoutLogin: {
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "transparent",
    color: "#585858",

    justifyContent: "center",
  },
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   containerTop: {
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     borderColor: "gray",
//     borderWidth: 1,
//     borderStyle: "dashed",
//     height: "35%",
//     overflow: "hidden",
//   },
//   imgBackgroundBottomFade: {},
//   imgLogo: {
//     position: "absolute",
//     bottom: 0,
//   },
//   containerBottom: {
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
