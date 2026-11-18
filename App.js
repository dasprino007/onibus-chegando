import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { login, buscarLinhas } from "./src/services/olhovivo";
import MapaScreen from "./src/screens/MapaScreen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  const [termo, setTermo] = useState("");
  const [sugestoes, setSugestoes] = useState([]);

  // autocomplete com debounce de 400ms
  useEffect(() => {
    if (termo.length < 2) return setSugestoes([]);
    const t = setTimeout(async () => {
      const r = await buscarLinhas(termo);
      setSugestoes(Array.isArray(r) ? r.slice(0, 5) : []);
    }, 400);
    return () => clearTimeout(t);
  }, [termo]);

  const abrir = (linha) => navigation.navigate("Mapa", { linha });

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Linha ou destino (ex.: 8000, Lapa)"
        value={termo}
        onChangeText={setTermo}
        onSubmitEditing={() => sugestoes[0] && abrir(sugestoes[0])}
        style={{ borderWidth: 1, padding: 10 }}
      />
      {sugestoes.map((s) => (
        <TouchableOpacity
          key={s.cl}
          onPress={() => abrir(s)}
          style={{ padding: 10, borderBottomWidth: 1 }}
        >
          <Text>
            {s.lt}-{s.tl} | {s.tp} → {s.ts}
          </Text>
        </TouchableOpacity>
      ))}
      <Text style={{ fontSize: 11, marginTop: "auto" }}>
        Dados: SPTrans / Olho Vivo
      </Text>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    login();
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Meu ônibus" }}
        />
        <Stack.Screen
          name="Mapa"
          component={MapaScreen}
          options={{ title: "Paradas" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
