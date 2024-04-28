import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import Loading from "../components/loading";
import {
  fallbackMoviePoster,
  fetchSearchMovies,
  image185,
} from "../api/moviedb";
import debounce from "lodash.debounce";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
let movieName = "Ant-Man and the Wasp: Quantumania";
export default function SearchScreen() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState(""); // search query
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleSearch = (value) => {
    if (value && value.length > 2) {
      setIsLoading(true);
      fetchSearchMovies({
        query: value,
        include_adult: false,
        language: "en-US",
        page: 1,
      }).then((data) => {
        setResults(data.results);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
      setResults([]);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <SafeAreaView className="flex-1 bg-neutral-800">
      <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
        <TextInput
          // value={query}
          onChangeText={handleTextDebounce}
          className="pb-1 pl-6 text-base font-semibold tracking-wider text-white flex-1"
          placeholder="Search Movie"
          placeholderTextColor={`lightgray`}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          className="rounded-full p-3 m-1 bg-neutral-500"
        >
          <FontAwesomeIcon icon={faX} size={25} color="white" />
        </TouchableOpacity>
      </View>

      {/* results */}
      {isLoading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          className="space-y-3"
        >
          <Text className="text-white font-semibold ml-1">
            Results ({results.length})
          </Text>
          <View className="flex-row justify-between flex-wrap">
            {results.map((item, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push("Movie", item)}
                >
                  <View className="space-y-2 mb-4">
                    <Image
                      source={{
                        uri: image185(item?.poster_path) || fallbackMoviePoster,
                      }}
                      style={{ width: width * 0.44, height: height * 0.3 }}
                      className="rounded-3xl"
                    />
                    <Text className="text-neutral-300 ml-1">
                      {item?.title.length > 22
                        ? item?.title.substring(0, 22) + "..."
                        : item?.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-row justify-center">
          <Image
            source={require("../assets/images/DisplayPicture.jpg")}
            className="h-96 w-96"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
