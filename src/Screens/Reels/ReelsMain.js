import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Dimensions, TouchableWithoutFeedback, Animated } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import { useIsFocused } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ReelsMain = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundStates, setSoundStates] = useState({});
  const [pausedStates, setPausedStates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSoundIcon, setShowSoundIcon] = useState(null);
  const [likedStates, setLikedStates] = useState({});
  const videoRefs = useRef([]);
  const flatListRef = useRef(null);
  const progressBars = useRef({});
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoCollection = await firestore().collection('Reels').get();
        const videoList = videoCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(videoList);
        setSoundStates(videoList.reduce((acc, video) => {
          acc[video.id] = true;
          return acc;
        }, {}));
        setPausedStates(videoList.reduce((acc, video) => {
          acc[video.id] = true;
          return acc;
        }, {}));
        setLikedStates(videoList.reduce((acc, video) => {
          acc[video.id] = false;
          return acc;
        }, {}));
        setLoading(false);
        flatListRef.current.scrollToIndex({ index: 0, animated: false });

        const userId = auth().currentUser?.uid;
        if (userId) {
          const likedCollection = await firestore().collection('Reels').get();
          const likedVideos = [];
          for (const video of videoList) {
            const likedDoc = await firestore()
              .collection('Reels')
              .doc(video.id)
              .collection('liked')
              .doc(userId)
              .get();
            if (likedDoc.exists) {
              likedVideos.push(video.id);
            }
          }
          setLikedStates(prevState => videoList.reduce((acc, video) => {
            acc[video.id] = likedVideos.includes(video.id);
            return acc;
          }, {}));
        }
      } catch (error) {
        console.error("Error fetching videos: ", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (isFocused) {
      const newPausedStates = videos.reduce((acc, video) => {
        acc[video.id] = false;
        return acc;
      }, {});
      setPausedStates(newPausedStates);

      // Seek videos to the beginning when the screen is focused
      videoRefs.current.forEach((videoRef) => {
        videoRef.seek(0);
      });
    } else {
      const newPausedStates = videos.reduce((acc, video) => {
        acc[video.id] = true;
        return acc;
      }, {});
      setPausedStates(newPausedStates);
    }
  }, [isFocused, videos]);

  const handleProgress = (videoId, { currentTime, duration }) => {
    const progress = currentTime / duration;
    if (progressBars.current[videoId]) {
      progressBars.current[videoId].setValue(progress);
    }
  };

  const handlePressIn = (videoId) => {
    setPausedStates(prevState => ({
      ...prevState,
      [videoId]: true,
    }));
  };

  const handlePressOut = (videoId) => {
    setPausedStates(prevState => ({
      ...prevState,
      [videoId]: false,
    }));
  };

  const handlePress = (videoId) => {
    const newSoundState = !soundStates[videoId];
    setSoundStates(prevState => ({
      ...prevState,
      [videoId]: newSoundState,
    }));

    setShowSoundIcon(newSoundState ? 'sound-on' : 'sound-off');
    setTimeout(() => setShowSoundIcon(null), 1000);
  };

  const handleEnd = () => {
    if (currentIndex < videos.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);

      const newPausedStates = videos.reduce((acc, video) => {
        acc[video.id] = true;
        return acc;
      }, {});

      if (videos[newIndex]) {
        newPausedStates[videos[newIndex].id] = false;
        videoRefs.current[videos[newIndex].id]?.seek(0);
        if (progressBars.current[videos[newIndex].id]) {
          progressBars.current[videos[newIndex].id].setValue(0);
        }
      }

      setPausedStates(newPausedStates);
    }
  }, [videos]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const handleLikePress = async (videoId) => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    const isLiked = likedStates[videoId];
    const videoRef = firestore().collection('Reels').doc(videoId);
    const likedRef = videoRef.collection('liked').doc(userId);

    try {
      if (isLiked) {
        await videoRef.update({
          likes: firestore.FieldValue.increment(-1),
        });
        await likedRef.delete();
      } else {
        await videoRef.update({
          likes: firestore.FieldValue.increment(1),
        });
        await likedRef.set({ userId });
      }

      setLikedStates(prevState => ({
        ...prevState,
        [videoId]: !isLiked,
      }));
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  const handleShare = (item) => {
    // Implement sharing functionality here
  };

  const renderItem = ({ item }) => {
    if (!progressBars.current[item.id]) {
      progressBars.current[item.id] = new Animated.Value(0);
    }

    return (
      <View style={styles.videoContainer}>
        <TouchableWithoutFeedback
          onPressIn={() => handlePressIn(item.id)}
          onPressOut={() => handlePressOut(item.id)}
          onPress={() => handlePress(item.id)}
        >
          <View style={styles.videoWrapper}>
            <Video
              ref={(ref) => (videoRefs.current[item.id] = ref)}
              source={{ uri: item.url }}
              style={styles.video}
              controls={false}
              resizeMode="contain"
              muted={!soundStates[item.id]}
              paused={pausedStates[item.id]}
              onEnd={handleEnd}
              repeat={false}
              onProgress={(data) => handleProgress(item.id, data)}
              onBuffer={() => {}}
              onError={() => {}}
            />
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressBars.current[item.id].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
            {showSoundIcon === 'sound-on' && (
              <View style={styles.iconContainer}>
                <Icon name="volume-up" size={30} color="white" />
              </View>
            )}
            {showSoundIcon === 'sound-off' && (
              <View style={styles.iconContainer}>
                <Icon name="volume-off" size={30} color="white" />
              </View>
            )}
            <View style={styles.sideIconsContainer}>
              <TouchableWithoutFeedback onPress={() => handleLikePress(item.id)}>
                <View style={styles.iconWrapper}>
                  <Icon
                    name={likedStates[item.id] ? 'heart' : 'heart-o'}
                    size={30}
                    color={likedStates[item.id] ? 'red' : 'white'}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => handleShare(item)}>
                <View style={styles.iconWrapper}>
                  <Icon name="share" size={30} color="white" />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => (
          { length: screenHeight, offset: screenHeight * index, index }
        )}
        snapToInterval={screenHeight}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWrapper: {
    width: screenWidth,
    height: screenHeight,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  progressBar: {
    position: 'absolute',
    bottom: 10,
    height: 3,
    backgroundColor: 'red',
  },
  iconContainer: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
  sideIconsContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 25,
  },
  flatListContent: {
    flexGrow: 1,
  },
});

export default ReelsMain;
