import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Vibration,
} from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { distanciaKm, minutosAte } from "../utils/geo";
import { paradasDaLinha, previsao, posicaoDaLinha } from '../services/olhovivo';
import Mapa from "../components/mapa";


export default function MapaScreen({ route }) {
  const { linha } = route.params;
  const mapRef = useRef(null);
  const avisou = useRef(false);
  const [coords, setCoords] = useState(null);
  const [paradas, setParadas] = useState([]);
  const [sel, setSel] = useState(null);
  const [minutos, setMinutos] = useState(null);
  const [onibus, setOnibus] = useState([]);

  console.log(linha)

  // GPS + paradas mais próximas
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted")
        return Alert.alert("Permita o GPS para ver as paradas próximas.");
      const { coords } = await Location.getCurrentPositionAsync({});
      setCoords(coords);
      const lista = await paradasDaLinha(linha.cl);
      console.log(lista)
      lista.sort(
        (a, b) =>
          distanciaKm(coords.latitude, coords.longitude, a.py, a.px) -
          distanciaKm(coords.latitude, coords.longitude, b.py, b.px),
      );
      setParadas(lista.slice(0, 8));
    })();
  }, []);

    useEffect(() => {
    const buscar = async () => {
      const r = await posicaoDaLinha(linha.cl);
      setOnibus(r?.vs ?? []);
    };
    buscar();
    const id = setInterval(buscar, 15000);
    return () => clearInterval(id);
  }, []);

  // previsão da parada selecionada (atualiza a cada 30s)
  useEffect(() => {
    if (!sel) return;
    avisou.current = false;
    const checar = async () => {
      const r = await previsao(sel.cp, linha.cl);
      const v = r?.p?.l?.[0]?.vs?.[0];
      if (!v) return setMinutos(null);
      const min = minutosAte(r.hr, v.t);
      setMinutos(min);
      if (min <= 5 && !avisou.current) {
        avisou.current = true;
        Vibration.vibrate([0, 500, 200, 500]);
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Seu ônibus está chegando!",
            body: `${linha.lt} chega em ${min} min`,
          },
          trigger: null,
        });
      }
    };
    checar();
    const id = setInterval(checar, 30000);
    return () => clearInterval(id);
  }, [sel]);

  function escolher(p) {
    setSel(p);
    setMinutos(null);
    mapRef.current?.animateToRegion(
      {
        latitude: p.py,
        longitude: p.px,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      },
      600,
    );
  }

  if (!coords)
    return <Text style={{ padding: 20 }}>Obtendo localização...</Text>;

  return (
    <View style={{ flex: 1 }}>
    <Mapa ref={mapRef} coords={coords} paradas={paradas} sel={sel} onSelect={escolher} onibus={onibus} />

      <View style={{ maxHeight: "auto", padding: 12 }}>
        <Text style={{ fontSize: 28, textAlign: "center" }}>
          {!sel
            ? "Escolha uma parada"
            : minutos === null
              ? "Sem previsão"
              : `Faltam ${minutos} min`}
        </Text>
        <ScrollView>
          {paradas.map((p) => (
            <TouchableOpacity
              key={p.cp}
              onPress={() => escolher(p)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 8,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  marginRight: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {sel?.cp === p.cp && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#000",
                    }}
                  />
                )}
              </View>
              <Text style={{ flex: 1 }}>
                {p.np} - {p.ed}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
