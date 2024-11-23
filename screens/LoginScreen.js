import React, { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { TextInput } from "react-native";

import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    navigation.replace("Main")
                }
            } catch (err) {
                console.log("error message", err)
            }
        };
        checkLoginStatus();
    }, [])
    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        }
        axios.post("http://localhost:8000/login", user).then((response) => {
            console.log(response);
            const token = response.data.token;
            AsyncStorage.setItem("authToken", token);
            navigation.replace("Main");

        }).catch((error) => {
            Alert.alert("Login Error", "Invalid Email");
            console.log(error);
        });
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
            <View>
                <Image
                    style={{ width: 150, height: 100, resizeMode: "contain",marginTop:20 }}
                    source={require('../assets/6160562276000b00045a7d97.png')}
                />
            </View>
            <KeyboardAvoidingView behavior="padding">
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 12, color: "#041E42" }}>Đăng Nhập Tài Khoản</Text>
                </View>
                <View style={{ marginTop: 70 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColo: "#D0D0D0", paddingVertical: 5, marginTop: 30, borderRadius: 5 }}>
                        <MaterialIcons style={{ marginLeft: 8 }} name="email" size={24} color="gray" />

                        <TextInput value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={{ color: "gray", marginVertical: 10, width: 300, fontSize: email ? 16 : 16 }} placeholder="Nhập email của bạn" />
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColo: "#D0D0D0", paddingVertical: 5, marginTop: 30, borderRadius: 5 }}>
                        <AntDesign name="lock1" size={24} color="gray" style={{ marginLeft: 8 }} />
                        <TextInput
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                            style={{ color: "gray", marginVertical: 10, width: 300, fontSize: password ? 16 : 16 }} placeholder="Nhập mật khẩu của bạn" />
                    </View>
                </View>
                <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Ghi nhớ tài khoản đăng nhập</Text>
                    <Text style={{ color: "#007FFF", fontWeight: "500" }}>Quên Mật Khẩu</Text>
                </View>
                <View style={{ marginTop: 80 }} />
                <Pressable onPress={handleLogin} style={{ width: 200, backgroundColor: "#FEBE10", borderRadius: 6, marginRight: "auto", marginLeft: "auto", padding: 15, alignItems: 'center' }}>
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Đăng Nhập</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 15 }}>
                    <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>Chưa có tài khoảng? Đăng Ký</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({});

export default LoginScreen;