import { forwardRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Mapa = forwardRef(function Mapa(
  { coords, paradas, sel, onSelect, onibus = [] },
  ref,
) {
  return (
    <MapView
      ref={ref}
      style={{ height: "35%" }}
      showsUserLocation
      initialRegion={{
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }}
    >
      {paradas.map((p) => (
        <Marker
          key={p.cp}
          coordinate={{ latitude: p.py, longitude: p.px }}
          title={p.np}
          pinColor={sel?.cp === p.cp ? "green" : "red"}
          onPress={() => onSelect(p)}
        />
      ))}
      {onibus.map((o) => (
        <Marker
          key={o.p}
          coordinate={{ latitude: o.py, longitude: o.px }}
          title={`Ônibus ${o.p}`}
          description={o.a ? "Acessível" : undefined}
          tracksViewChanges={false}
        >
          <MaterialCommunityIcons
            name="bus"
            size={28}
            color={o.a ? "#1565c0" : "#e65100"}
          />
        </Marker>
      ))}
    </MapView>
  );
});

export default Mapa;
