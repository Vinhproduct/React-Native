import { StyleSheet, Text, View, Platform, ScrollView, Image, TextInput, Pressable, SafeAreaView } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AntDesign, Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import ProductItem from '../components/ProductItem';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { UserType } from '../UserContext';


const HomeScreen = () => {
  const list = [
    {
      id: "0",
      image: require("../assets/home/41EcYoIZhIL._AC_SY400_.jpg"),
      name: "Home",
    },
    {
      id: "1",
      image: require("../assets/home/blockbuster.jpg"),
      name: "Deals",
    },
    {
      id: "3",
      image: require("../assets/home/31dXEvtxidL._AC_SX368_.jpg"),
      name: "Electronics",
    },
    {
      id: "4",
      image: require("../assets/home/All_Icons_Template_1_icons_01.jpg"),
      name: "Mobiles",
    },
    {
      id: "5",
      image: require("../assets/home/music.jpg"),
      name: "Music",
    },
    {
      id: "6",
      image: require("../assets/home/51dZ19miAbL._AC_SY350_.jpg"),
      name: "Fashion",
    },
  ];
  const slider = [
    require("../assets/slide/photo.jpg"),
    require("../assets/slide/Updated_ingress1242x550_3.jpg"),
    require("../assets/slide/1242x550_Header-BB-Jul23.jpg"),
  ];
  const deals = [
    {
      id: "20",
      title: "OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB Storage)",
      oldPrice: 25000,
      price: 19000,
      image:
        require("../assets/deals/samsung1.jpg"),
      carouselImages: [
        require("../assets/deals/61QRgOgBx0L._SX679_.jpg"),
        require("../assets/deals/61uaJPLIdML._SX679_.jpg"),
        require("../assets/deals/510YZx4v3wL._SX679_.jpg"),
        require("../assets/deals/61J6s1tkwpL._SX679_.jpg"),
      ],
      color: "Stellar Green",
      size: "6 GB RAM 128GB Storage",
    },
    {
      id: "30",
      title:
        "Samsung Galaxy S20 FE 5G (Cloud Navy, 8GB RAM, 128GB Storage) with No Cost EMI & Additional Exchange Offers",
      oldPrice: 74000,
      price: 26000,
      image:
        require("../assets/deals/3a.jpg"),
      carouselImages: [
        require("../assets/deals/81vDZyJQ-4L._SY879_.jpg"),
        require("../assets/deals/61vN1isnThL._SX679_.jpg"),
        require("../assets/deals/71yzyH-ohgL._SX679_.jpg"),
        require("../assets/deals/61vN1isnThL._SX679_.jpg"),
      ],
      color: "Cloud Navy",
      size: "8 GB RAM 128GB Storage",
    },
    {
      id: "40",
      title:
        "Samsung Galaxy M14 5G (ICY Silver, 4GB, 128GB Storage) | 50MP Triple Cam | 6000 mAh Battery | 5nm Octa-Core Processor | Android 13 | Without Charger",
      oldPrice: 16000,
      price: 14000,
      image:
        require("../assets/deals/samsung3.jpg"),
      carouselImages: [
        require("../assets/deals/817WWpaFo1L._SX679_.jpg"),
        require("../assets/deals/81KkF-GngHL._SX679_.jpg"),
        require("../assets/deals/61IrdBaOhbL._SX679_.jpg"),
      ],
      color: "Icy Silver",
      size: "6 GB RAM 64GB Storage",
    },
    {
      id: "40",
      title:
        "realme narzo N55 (Prime Blue, 4GB+64GB) 33W Segment Fastest Charging | Super High-res 64MP Primary AI Camera",
      oldPrice: 12999,
      price: 10999,
      image:
        require("../assets/deals/xcm_banners_2022_in_bau_wireless_dec_580x800_v1-n55-marchv2-mayv3-v4_580x800_in-en.jpg"),
      carouselImages: [
        require("../assets/deals/41Iyj5moShL._SX300_SY300_QL70_FMwebp_.jpg"),
        require("../assets/deals/61og60CnGlL._SX679_.jpg"),
        require("../assets/deals/61twx1OjYdL._SX679_.jpg"),
      ],
    },
  ];
  const offers = [
    {
      id: "0",
      title:
        "Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)",
      offer: "72% off",
      oldPrice: 7500,
      price: 4500,
      image:
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg",
      ],
      color: "Màu Xanh Lá",
      size: "Bình thường",
    },
    {
      id: "1",
      title:
        "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg",
      ],
      color: "Màu Đen",
      size: "Bình Tường",
    },
    {
      id: "2",
      title: "Aishwariya System On Ear Wireless On Ear Bluetooth Headphones",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg",
      carouselImages: ["https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg"],
      color: "Màu Đen",
      size: "Bình Tường",
    },
    {
      id: "3",
      title:
        "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
      offer: "40%",
      oldPrice: 24999,
      price: 19999,
      image: "https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
        "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg",
      ],
      color: "Na Uy xanh",
      size: "8GB RAM, 128GB Storage",
    },
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((currentImageIndex + 1) % slider.length);
    }, 1500); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [currentImageIndex]);
  // khai bao
  // 
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("jewelery");
  const [items, setItems] = useState([
    { label: "Đồ nam", value: "men's clothing" },

    { label: "Trang sức", value: "jewelery" },

    { label: "Đồ điện tử", value: "electronics" },
    
    { label: "Đồ nữ", value: "women's clothing" },
  ]);
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [selectedAddress, setSelectedAdress] = useState("");
  // console.log("selectedAddress",selectedAddress);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
      } catch (error) {
        console.log("error message", error);
      }
    };

    fetchData();
  }, []);
  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);
  const cart = useSelector((state) => state.cart.cart);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/addresses/${userId}`);


      const { addresses } = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);
  // console.log("addrress", addresses);
  return (
    <>
      <SafeAreaView style={{ padding: Platform.OS === "android" ? 40 : 0, flex: 1, backgroundColor: "white" }}>
        <ScrollView>
          <View style={{ backgroundColor: "#00CED1", padding: 10, flexDirection: "row", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 7, padding: 5, backgroundColor: "white", borderRadius: 3, height: 38, flex: 1 }}>
              <AntDesign style={{ paddingLeft: 10 }} name='search1' size={22} color="black" />
              <TextInput style={{ flex: 1 }} placeholder='Tìm kiếm sản phẩm' />
            </View>
            <Feather style={{ paddingLeft: 10 }} name='mic' size={24} color="black" />
          </View>

          <Pressable onPress={() => setModalVisible(!modalVisible)}
            style={{ flexDirection: "row", alignItems: "center", padding: 10, gap: 5, backgroundColor: "#AFEEEE" }}>
            <Ionicons name='location-outline' size={24} color="black" />
            <Pressable>
              {selectedAddress ? (
                <Text>
                  Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                  Thêm địa chỉ
                </Text>
              )}
            </Pressable>
            <MaterialIcons name='keyboard-arrow-down' size={24} color="black" />
          </Pressable>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {list.map((item, index) => (
              <Pressable key={item.id} style={{ margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ width: 50, height: 50, resizeMode: "contain" }} source={item.image} />
                <Text style={{ alignItems: "center", fontSize: 12, fontWeight: "500", marginTop: 5 }}>{item?.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable onPress={() => setCurrentImageIndex((currentImageIndex + 1) % slider.length)}>
            <Image style={{ width: '100%', height: 200 }} source={slider[currentImageIndex]} />
          </Pressable>
          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>

            Ưu đãi thịnh hành trong tuần
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {deals.map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })
                }
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 180, height: 180, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />
              </Pressable>
            ))}
          </View>
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />
          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Ưu đãi hôm nay
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {offers.map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })
                }
                style={{
                  marginVertical: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ width: 150, height: 150, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />

                <View
                  style={{
                    backgroundColor: "#E31837",
                    paddingVertical: 5,
                    width: 130,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    Upto {item?.offer}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          {/*  */}
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />
          <View
            style={{
              marginHorizontal: 10,
              marginTop: 20,
              width: "45%",
              marginBottom: open ? 50 : 15,
            }}
          >
            <DropDownPicker
              style={{
                borderColor: "#B7B7B7",
                height: 30,
                marginBottom: open ? 120 : 15,
              }}
              open={open}
              value={category} //genderValue
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="choose category"
              placeholderStyle={styles.placeholderStyles}
              onOpen={onGenderOpen}
              // onChangeValue={onChange}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
            {products
              ?.filter((item) => item.category === category)
              .map((item, index) => (
                <ProductItem item={item} key={index} />
              ))}

          </View>

        </ScrollView>
      </SafeAreaView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Chọn vị trí của bạn
            </Text>

            <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
              Chọn địa điểm giao hàng để xem tình trạng còn hàng và giao hàng của sản phẩm
              tùy chọn
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* already added addresses */}
            {addresses?.map((item, index) => (
              <Pressable
                onPress={() => setSelectedAdress(item)}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  marginRight: 15,
                  marginTop: 10,
                  backgroundColor: selectedAddress === item ? "#FBCEB1" : "white"
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                    {item?.name}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.houseNo},{item?.landmark}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.street}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  India, Bangalore
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: "500",
                }}
              >
                
Thêm địa chỉ hoặc điểm nhận hàng
              </Text>
            </Pressable>
          </ScrollView>

          <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="location-pin" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Nhập mã pin của bạn
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="locate-sharp" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Sử dụng Vị trí hiện tại của tôi
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AntDesign name="earth" size={22} color="#0066b2" />

              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Giao hàng bên ngoài nước
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({});