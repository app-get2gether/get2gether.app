import { EditableInput, EditableTextarea } from "@/components/Editable";
import GMaps from "@/components/GMaps";
import Modal from "@/components/tgbot/Modal";
import { TCreateEventStore, useCreateEventStore } from "@/store";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Loader } from "@googlemaps/js-api-loader";
import SimpleLoader from "@/components/SimpleLoader";

const searchAddress = async (address: string) => {
  if (!process.env.NEXT_PUBLIC_GMAPS_API_KEY) {
    throw new Error("process.env.NEXT_PUBLIC_GMAPS_API_KEY is required for the Google Maps API");
  }
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GMAPS_API_KEY,
    version: "weekly",
  });
  const google = await loader.load();
  const { Geocoder } = (await google.maps.importLibrary("geocoding")) as google.maps.GeocodingLibrary;
  const geocoder = new Geocoder();
  const res = await geocoder.geocode({ address });
  return res;
};

export default function LocationButton() {
  const { t } = useTranslation();
  const { address, addressInfo, location, setLocation, setAddress, setAddressInfo } = useCreateEventStore(
    (state: TCreateEventStore) => ({
      address: state.address,
      addressInfo: state.addressInfo,
      location: state.location,
      setAddress: state.setAddress,
      setAddressInfo: state.setAddressInfo,
      setLocation: state.setLocation,
    }),
  );
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [_address, _setAddress] = useState(address);
  const [_addressInfo, _setAddressInfo] = useState(addressInfo);
  const [_location, _setLocation] = useState(location);
  const [pinWasMoved, setPinWasMoved] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const onLocationButtonClick = useCallback(() => {
    setShowLocationModal(true);
  }, [setShowLocationModal]);

  const onSetLocation = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      _setLocation({ lat, lng });
      setPinWasMoved(true);
    },
    [_setLocation, setPinWasMoved],
  );

  const onCloseLocationModal = useCallback(() => {
    setShowLocationModal(false);
  }, [setShowLocationModal]);

  const onSearchAddress = useCallback(
    async (force: boolean = false) => {
      if (!_address.trim()) return;
      // Don't make search request if pin was moved
      if (!force && pinWasMoved) return;
      setIsSearching(true);
      let res;
      try {
        res = await searchAddress(_address);
      } finally {
        setIsSearching(false);
      }
      // TODO: handle error
      if (!res) throw new Error("No response from Google Maps API");
      if (!res.results) return;
      const firstResult = res.results[0];
      const location = firstResult.geometry.location;
      const lat = location.lat();
      const lng = location.lng();
      setLocation({ lat, lng });
      if (markerRef.current) {
        markerRef.current.position = { lat, lng };
        markerRef.current.map?.panTo({ lat, lng });
      }
    },
    [_address, setLocation, setIsSearching, pinWasMoved],
  );

  const onSetAddress = useCallback(
    (value: string) => {
      _setAddress(value);
    },
    [_setAddress],
  );

  const onSetAddressInfo = useCallback(
    (value: string) => {
      _setAddressInfo(value);
    },
    [_setAddressInfo],
  );

  const onSubmit = useCallback(() => {
    setAddress(_address);
    setAddressInfo(_addressInfo);
    setLocation(_location);
  }, [_address, _addressInfo, _location, setAddress, setAddressInfo, setLocation]);

  return (
    <div className="inline-flex cursor-pointer animated-on-press">
      <label className="mr-4 text-primary">
        <MapPinIcon className="w-6 h-6 -mt-1 inline-block" />
      </label>
      <div>
        <button className="rounded-md truncate" onClick={onLocationButtonClick}>
          {t("create_event.select_location_button")}
        </button>
      </div>
      {typeof window !== "undefined" &&
        window.document &&
        createPortal(
          <Modal open={showLocationModal} onClose={onCloseLocationModal}>
            <div>
              <div>
                <div className="relative">
                  <EditableInput
                    className="text-primary my-3 textarea-lg p-3 pr-9"
                    placeholder={t("create_event.set_location_address")}
                    onChange={onSetAddress}
                    onSubmit={() => onSearchAddress(false)}
                    value={address}
                  />
                  <div
                    className="absolute top-0 right-2 h-full w-8 cursor-pointer z-2 animated-on-press"
                    onClick={() => onSearchAddress(true)}
                  >
                    {isSearching ? (
                      <SimpleLoader className="w-7 h-7 mx-auto mt-5" />
                    ) : (
                      <MagnifyingGlassIcon className="w-6 h-6 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
                    )}
                  </div>
                </div>
                <GMaps
                  onSetLocation={onSetLocation}
                  lat={location && location.lat}
                  lng={location && location.lng}
                  markerRef={markerRef}
                />
                <EditableTextarea
                  className="px-3 py-1 my-3 min-h-20"
                  placeholder={t("create_event.set_location_notes")}
                  onSubmit={onSetAddressInfo}
                />
                <button className="btn btn-primary w-full mb-7" onClick={() => setShowLocationModal(false)}>
                  {t("create_event.set_location_button")}
                </button>
              </div>
            </div>
          </Modal>,
          document.body,
        )}
    </div>
  );
}
