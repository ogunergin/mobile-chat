import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export const launchImagePicker = async () => {
    await checkMediaPermissions();
};

const checkMediaPermissions = async () => {
  if (Platform.OS !== "web") {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      return Promise.reject("Permission to access camera roll is required!");
    }
  }
  return Promise.resolve();
};