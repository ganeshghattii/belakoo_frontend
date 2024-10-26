import React, { useRef, useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber/native";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { TextureLoader } from "three";

// Function to convert Google Drive link to direct image link
const getDirectImageUrl = (driveUrl) => {
  const fileId = driveUrl.match(/[-\w]{25,}/);
  return fileId 
    ? `https://drive.google.com/uc?export=view&id=${fileId[0]}`
    : driveUrl;
};

const CubeComponent = ({ subjects = [] }) => {
  const router = useRouter();
  const mesh = useRef(null);

  // Load textures for cube faces
  const defaultTexture = useMemo(() => {
    try {
      return new TextureLoader().load(
        require("./defaultface.png"),
        undefined,
        undefined,
        (error) => console.error("Error loading default texture:", error)
      );
    } catch (error) {
      console.error("Error creating default texture:", error);
      return null;
    }
  }, []);

  const textures = useMemo(() => {
    const loadedTextures = subjects.map((subject, index) => {
      try {
        const directUrl = getDirectImageUrl(subject.icon);
        return new TextureLoader().load(
          directUrl,
          (texture) => console.log(`Texture ${index} loaded successfully`),
          undefined,
          (error) => console.error(`Error loading texture ${index}:`, error)
        );
      } catch (error) {
        console.error(`Error creating texture ${index}:`, error);
        return defaultTexture;
      }
    });

    while (loadedTextures.length < 6) {
      loadedTextures.push(defaultTexture);
    }

    return loadedTextures;
  }, [subjects, defaultTexture]);

  // Handle face click by detecting which face was clicked
  const handleFaceClick = (event) => {
    const intersection = event.intersections[0];
    const faceIndex = intersection.face.materialIndex;

    if (faceIndex < subjects.length) {
      const selectedSubject = subjects[faceIndex];
      router.push({
        pathname: "/grades",
        params: { 
          subjectId: selectedSubject.id,
          subjectName: selectedSubject.name
        }
      });
    }
  };

  return (
    <mesh ref={mesh} onClick={handleFaceClick}>
      <boxGeometry args={[2.75, 2.75, 2.75]} />
      {textures.map((texture, index) => (
        <meshStandardMaterial
          key={index}
          map={texture}
          attach={`material-${index}`}
          color={texture ? undefined : 'red'} // Fallback color if texture fails to load
        />
      ))}
    </mesh>
  );
};

const Cube = ({ subjects }) => {

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={false}
          rotateSpeed={1.0}
        />
        <CubeComponent subjects={subjects} />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  canvas: {
    flex: 1,
  },
});

export default Cube;
