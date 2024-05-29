import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

const DEFAULT_LAT = 37.7749;
const DEFAULT_LNG = -122.4194;

export default function GMaps({
  lat,
  lng,
  onSetLocation,
}: {
  lat: number | null;
  lng: number | null;
  onSetLocation: ({ lat, lng }: { lat: number; lng: number }) => void;
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GMAPS_API_KEY) {
      throw new Error("process.env.NEXT_PUBLIC_GMAPS_API_KEY is required for the Google Maps API");
    }
    const node = ref.current;
    if (!node) {
      throw new Error("ref.current is required for the Google Maps API");
    }
    if (!navigator.geolocation) {
      throw new Error("navigator.geolocation is not supported by your browser");
    }
    const apiKey = process.env.NEXT_PUBLIC_GMAPS_API_KEY;
    if (!apiKey) {
      throw new Error("process.env.NEXT_PUBLIC_GMAPS_API_KEY is required for the Google Maps API");
    }

    async function loadGoogleMaps(node: HTMLElement) {
      const loader = new Loader({
        apiKey,
        version: "weekly",
      });
      const mapOptions = {
        zoom: 14,
        disableDefaultUI: true,
        mapId: "create_event_map",
        clickableIcons: false,
      };

      async function showMap(lat: number, lng: number) {
        const google = await loader.load();
        const map = new google.maps.Map(node, { ...mapOptions, ...{ center: { lat, lng } } });
        const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
        const marker = new AdvancedMarkerElement({
          map,
          position: { lat, lng },
          gmpDraggable: true,
        });
        marker.addListener("dragend", () => {
          const position = marker.position;
          if (!position) return;
          const new_lat = typeof position.lat === "function" ? position.lat() : position.lat;
          const new_lng = typeof position.lng === "function" ? position.lng() : position.lng;
          onSetLocation({ lat: new_lat, lng: new_lng });
        });
        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return;
          event.domEvent.preventDefault();
          event.domEvent.stopPropagation();
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          marker.position = { lat, lng };
          onSetLocation({ lat, lng });
        });
      }

      if (lat && lng) {
        showMap(lat, lng);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          showMap(position.coords.latitude, position.coords.longitude);
        },
        () => {
          showMap(DEFAULT_LAT, DEFAULT_LNG);
        },
      );
    }

    loadGoogleMaps(node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSetLocation]);

  return <div ref={ref} className="w-full h-96 rounded-xl z-0"></div>;
}
