import { Image, Pressable, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartReducer';

const ProductItem = ({ item }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };
  return (
    <Pressable style={{ marginHorizontal: 20, marginVertical: 25 }}>
      <Image style={{ width: 150, height: 150, resizeMode: "contain" }} source={{ uri: item?.image }} />
      <Text numberOfLines={1} style={{ width: 150, marginTop: 10 }}>{item?.title}</Text>

      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item?.price}VNĐ</Text>
        <Text style={{ color: "#FFC72C", fontWeight: "bold" }}>
          {item?.rating?.rate} ratings
        </Text>
      </View>
      {/* add cart */}
      <Pressable
        onPress={() => addItemToCart(item)}
        style={{
          backgroundColor: "#FFC72C",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
        {addedToCart ? (
          <View>
            <Text>Đã thêm vào giỏ hàng</Text>
          </View>
        ) : (
          <Text>Thêm vào giỏ hàng</Text>

        )}
      </Pressable>
    </Pressable>
  );
};

export default ProductItem

const styles = StyleSheet.create({})