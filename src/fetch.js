// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, StyleSheet } from "react-native";
// import { firebase } from "../config";
// import { S3 } from "aws-sdk";
// import * as FileSystem from "expo-file-system";
// import { Video } from "expo-av";

// const Fetch = () => {
//   const [users, setUsers] = useState([]);
//   const [s3, setS3] = useState(null);

//   useEffect(() => {
//     console.log("check")
//     const s3Client = new S3({
//       accessKeyId: 'AKIATRKPRG7S6TZBTMGC',
//       secretAccessKey: '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',
//       region: "us-east-1",
//     });
//     setS3(s3Client);

//     const unsubscribe = firebase
//       .firestore()
//       .collection("videos")
//       .onSnapshot((querySnapshot) => {
//         const users = [];
//         querySnapshot.forEach((doc) => {
//           const { creator, description, filename, isBookmarked, url } = doc.data();
//           users.push({
//             id: doc.id,
//             creator,
//             description,
//             filename,
//             isBookmarked,
//             url,
//           });
//         });
//         setUsers(users);
//       });
//     return () => unsubscribe();
//   }, []);

//   const fetchVideoFromS3 = async (url) => {
//     const key = url.substring(url.lastIndexOf("/") + 1);
//     console.log(key)
//     const localUri = `${FileSystem.cacheDirectory}${key}`;
//     const file = await FileSystem.getInfoAsync(localUri);
//     if (file.exists) {
//       return { uri: localUri };
//     }
//     const downloadResumable = FileSystem.createDownloadResumable(
//       url,
//       localUri,
//       {},
//       (downloadProgress) => {
//         console.log(
//           `Downloading: ${downloadProgress.totalBytesWritten} bytes written`
//         );
//       }
//     );
//     const response = await downloadResumable.downloadAsync();
//     console.log("download response", response);

//     const s3Object = await s3
//       .getObject({
//         Bucket: "diall-app",
//         Key: key,
//       })
//       .promise();

//     await FileSystem.writeAsStringAsync(localUri, s3Object.Body, {
//       encoding: FileSystem.EncodingType.Base64,
//     });

//     return { uri: localUri };
//   };

//   return (
//     <View style={{ flex: 1, marginTop: 100 }}>
//       <FlatList
//         style={{ height: "100%" }}
//         data={users}
//         numColumns={1}
//         renderItem={({ item }) => (
//           <View>
//             <Text>{item.creator}</Text>
//             <Text>{item.description}</Text>
//             <Video
//               source={{ uri: item.url, fetchMethod: fetchVideoFromS3 }}
//               resizeMode="contain"
//               style={{ height: 200 }}
//             />
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default Fetch;

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { firebase } from "../config";
import { S3 } from "aws-sdk";
import * as FileSystem from "expo-file-system";
import { Video } from "expo-av";

const Fetch = () => {
  const [users, setUsers] = useState([]);
  const [s3, setS3] = useState(null);

  useEffect(() => {
    console.log('check')
    const s3Client = new S3({
        accessKeyId: 'AKIATRKPRG7S6TZBTMGC',
        secretAccessKey: '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',
        region: "us-east-1",
    });
    setS3(s3Client);

    const unsubscribe = firebase
      .firestore()
      .collection("videos")
      .onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          const { creator, description, filename, isBookmarked, url } = doc.data();
          users.push({
            id: doc.id,
            creator,
            description,
            filename,
            isBookmarked,
            url,
          });
        });
        setUsers(users);
      });
    return () => unsubscribe();
  }, []);

  const fetchVideoFromS3 = async (url) => {
    const key = url.substring(url.lastIndexOf("/") + 1);
    const localUri = `${FileSystem.cacheDirectory}${key}`;
    const file = await FileSystem.getInfoAsync(localUri);
    if (file.exists) {
      return { uri: localUri };
    }
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      localUri,
      {},
      (downloadProgress) => {
        console.log(
          `Downloading: ${downloadProgress.totalBytesWritten} bytes`
        );
      }
    );
    const response = await downloadResumable.downloadAsync();
    console.log("download response", response);

    const s3Object = await s3
      .getObject({
        Bucket: "diall-app",
        Key: key,
      })
      .promise();

    await FileSystem.writeAsStringAsync(localUri, s3Object.Body, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return { uri: localUri };
  };

  return (
    <View style={{ flex: 1, marginTop: 100 }}>
      <FlatList
        style={{ height: "100%" }}
        data={users}
        numColumns={1}
        renderItem={({ item, index }) => (
          <View>
            <Text>{item.creator}</Text>
            <Text>{item.description}</Text>
            {index === 0 ? (
              <Video
                source={{ uri: item.url, fetchMethod: fetchVideoFromS3 }}
                resizeMode="contain"
                style={{ height: 200 }}
              />
            ) : null}
          </View>
        )}
        keyExtractor={(item) => item.id}
        initialNumToRender={1}
        removeClippedSubviews={true}
        maxToRenderPerBatch={1}
        windowSize={2}
        updateCellsBatchingPeriod={30}
      />
    </View>
  );
};

export default Fetch;


