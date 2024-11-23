import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { UserType } from '../UserContext';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { Alert } from 'react-native';
const AddressScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [street, setStreet] = useState("");
    const [landmark, setLandmark] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const { userId, setUserId } = useContext(UserType);
    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem("authToken");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            setUserId(userId)
        }

        fetchUser();
    }, []);
    console.log("UserID", userId)
    const handleAddAddress = () => {
        const address = {
            name,
            mobileNo,
            houseNo,
            street,
            landmark,
            postalCode
        }
        axios.post("http://localhost:8000/addresses", { userId, address }).then((response) => {
            Alert.alert("Thành công", "Thêm địa chỉ thành công");
            setName("");
            setMobileNo("");
            setHouseNo("");
            setStreet("");
            setLandmark("");
            setPostalCode("");

            setTimeout(() => {
                navigation.goBack();
            }, 500)
        }).catch((error) => {
            Alert.alert("Lỗi", "Thêm địa chỉ không thành công");
            console.log("Lỗi", error)
        })
    }
    return (
        <ScrollView style={{ marginTop: 50 }}>
            <View style={{ height: 50, backgroundColor: "#00CED1" }} />

            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Thêm địa chỉ mới
                </Text>

                <TextInput
                    placeholderTextColor={"black"}
                    placeholder="Việt Nam"
                    style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 1,
                        marginTop: 10,
                        borderRadius: 5,
                    }}
                />

                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Họ và Tên (First and last name)
                    </Text>

                    <TextInput
                        value={name}
                        onChangeText={(text) => setName(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder="nhập tên của bạn"
                    />
                </View>

                <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Số điện thoại di động
                    </Text>

                    <TextInput
                        value={mobileNo}
                        onChangeText={(text) => setMobileNo(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder="Số di động"
                    />
                </View>

                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Căn hộ,Số nhà,Tòa nhà,Công ty
                    </Text>

                    <TextInput
                        value={houseNo}
                        onChangeText={(text) => setHouseNo(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder="Địa chỉ nhận hàng"
                    />
                </View>

                <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                       
Khu vực, Đường phố, khu vực, thôn
                    </Text>
                    <TextInput
                        value={street}
                        onChangeText={(text) => setStreet(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder="Khu vực, Đường phố, khu vực, thôn"
                    />
                </View>

                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Gần vị trí</Text>
                    <TextInput
                        value={landmark}
                        onChangeText={(text) => setLandmark(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder="Gần vị trí"
                    />
                </View>

                <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Mã bưu điện</Text>

                    <TextInput
                        value={postalCode}
                        onChangeText={(text) => setPostalCode(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder="Mã bưu điện"
                    />
                </View>

                <Pressable
                    onPress={handleAddAddress}
                    style={{
                        backgroundColor: "#FFC72C",
                        padding: 19,
                        borderRadius: 6,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20,
                    }}
                >
                    <Text style={{ fontWeight: "bold" }}>
                    Thêm địa chỉ</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

export default AddressScreen

const styles = StyleSheet.create({})