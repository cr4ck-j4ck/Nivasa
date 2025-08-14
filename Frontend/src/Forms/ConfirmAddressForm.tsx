import ConfirmAddressForm from "@/Components/HostingProcess/AddressInput";
import LocationPickerMap from "@/Components/HostingProcess/LocationPicker";

export default function ConfirmAddress() {
  return (
    <div className="relative pb-40">
      <div className="rounded-2xl p-6 w-full max-w-2xl showHead mx-auto relative top-30">
        <h1 className="text-5xl font-bold mb-2">Confirm your address</h1>
        <p className="text-gray-600 mb-6">
          Your address is only shared with guests after they've made a reservation.
        </p>

        <ConfirmAddressForm />
      </div>

      <LocationPickerMap />
    </div>
  );
}
