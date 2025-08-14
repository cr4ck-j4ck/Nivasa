import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type TAddressFormValues } from "@/Schema/addressSchema";
import { useHostingProcessStore } from "@/Store/HostingProcessStore";
import { useShallow } from "zustand/react/shallow";

export default function ConfirmAddressForm() {
  const { address } = useHostingProcessStore(
    useShallow((state) => ({
      address: state.address,
    }))
  );

  const form = useForm<TAddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "India - IN",
      flatHouse: "",
      streetAddress: address?.streetAddress || "",
      landmark: address?.landmark || "",
      district: address?.district || "",
      city: address?.city || "",
      state: address?.city|| "",
      postalCode: address?.postalCode || "",
    },
  });

  const { register, handleSubmit, reset, formState } = form;
  const { errors } = formState;

  // Reset form whenever address in store changes
  useEffect(() => {
    if (address) {
      reset({
        country: "India - IN",
        flatHouse: "",
        streetAddress: address.streetAddress || "",
        landmark: address.landmark || "",
        district: address.district || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
      });
    }
  }, [address, reset]);

  const onSubmit = (data: TAddressFormValues) => {
    console.log("Submitted form data:", data);
    // You can push to store or API here
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Country/region
        </label>
        <select {...register("country")} className="mt-1 block w-full border rounded-lg p-2">
          <option value="India - IN">India - IN</option>
        </select>
        {errors.country && <p className="text-red-500">{errors.country.message}</p>}
      </div>

      {/* Flat/House */}
      <input
        {...register("flatHouse")}
        type="text"
        placeholder="Flat, house, etc. (if applicable)"
        className="w-full border rounded-lg p-2"
      />

      {/* Street address */}
      <input
        {...register("streetAddress")}
        type="text"
        placeholder="Street address"
        className="w-full border rounded-lg p-2"
      />
      {errors.streetAddress && <p className="text-red-500">{errors.streetAddress.message}</p>}

      {/* Landmark */}
      <input
        {...register("landmark")}
        type="text"
        placeholder="Nearby landmark (if applicable)"
        className="w-full border rounded-lg p-2"
      />

      {/* District */}
      <input
        {...register("district")}
        type="text"
        placeholder="District/locality"
        className="w-full border rounded-lg p-2"
      />

      {/* City */}
      <input
        {...register("city")}
        type="text"
        placeholder="City/town"
        className="w-full border rounded-lg p-2"
      />
      {errors.city && <p className="text-red-500">{errors.city.message}</p>}

      {/* State */}
      <input
        {...register("state")}
        type="text"
        placeholder="State/union territory"
        className="w-full border rounded-lg p-2"
      />
      {errors.state && <p className="text-red-500">{errors.state.message}</p>}

      {/* PIN code */}
      <input
        {...register("postalCode")}
        type="text"
        placeholder="PIN code"
        className="w-full border rounded-lg p-2"
      />
      {errors.postalCode && <p className="text-red-500">{errors.postalCode.message}</p>}

      <button
        type="submit"
        className="w-full bg-black text-white rounded-lg p-2 font-medium"
      >
        Save & Continue
      </button>
    </form>
  );
}
