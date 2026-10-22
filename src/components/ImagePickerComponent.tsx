
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';

import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
} from 'react-native-image-picker';

import Ionicons from '@react-native-vector-icons/ionicons';

type ImagePickerProps = {
  onImageSelected: (uri: string) => void;
};

export default function ImagePickerComponent({
  onImageSelected,
}: ImagePickerProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleImageResponse = (result: ImagePickerResponse) => {
    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert(
        'Image Picker Error',
        result.errorMessage || 'Unable to select image'
      );
      return;
    }

    const uri = result.assets?.[0]?.uri;

    if (uri) {
      setImageUri(uri);
      onImageSelected(uri);
    }
  };

  const pickFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      handleImageResponse
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
      },
      handleImageResponse
    );
  };

  const cancelImage = () => {
    setImageUri(null);
    onImageSelected('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Pressable
          style={styles.actionButton}
          onPress={cancelImage}
        >
          <Ionicons name="close" size={20} color="#555" />
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={pickFromGallery}
        >
          <Ionicons
            name="images-outline"
            size={20}
            color="#C9A227"
          />
          <Text style={styles.buttonText}>Gallery</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={openCamera}
        >
          <Ionicons
            name="camera-outline"
            size={20}
            color="#C9A227"
          />
          <Text style={styles.buttonText}>Camera</Text>
        </Pressable>
      </View>

      {imageUri !== null && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#C9A227',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelText: {
    color: '#777',
    fontSize: 15,
    fontWeight: '600',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginTop: 18,
  },
});
