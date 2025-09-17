import React, { useEffect } from 'react';
import './Slider.css';
import { useHostingProcessStore } from '@/Store/HostingProcessStore';
import { useShallow } from 'zustand/react/shallow';


const WeekendPrice = ():React.JSX.Element => {
  const basePrice = useHostingProcessStore(state => state.listingInfo.pricing.weekdayPrice);
  const maxPrice = Math.round(basePrice * 1.99);
  const { weekendPrice,setWeekendPrice} = useHostingProcessStore(useShallow(state => ({ setWeekendPrice: state.setWeekendPricing,weekendPrice: state.listingInfo.pricing.weekendPrice })));
  useEffect(() => {
    setWeekendPrice(basePrice);
  }, [basePrice, setWeekendPrice]);
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeekendPrice(Number(e.target.value));
  };

  const guestServiceFee = Math.round(weekendPrice * 0.1411);
  const guestPriceBeforeTaxes = weekendPrice + guestServiceFee;
  const hostEarnings = weekendPrice - Math.round(weekendPrice * 0.03);
  const weekendPremiumPercent = Math.round(((weekendPrice - basePrice) / basePrice) * 100);

  // Calculate progress as percentage for gradient fill
  const progressPercent = ((weekendPrice - basePrice) / (maxPrice - basePrice)) * 100;

  return (
    <div className="max-w-2xl w-[100vw] mx-auto p-6 font-sans relative top-50">
      <h2 className="text-4xl font-bold mb-1  becomeHostHeading">Set a weekend price</h2>
      <p className="text-gray-500 mb-6 text-lg">Add a premium for Fridays and Saturdays.</p>

      <div className="text-center py-5">
        <div className="text-8xl font-bold mb-1 showHead col-black">₹{weekendPrice.toLocaleString()}</div>
      <p className="text-gray-600 mb-6 text-sm">Guest price before taxes ₹{guestPriceBeforeTaxes.toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium">Weekend premium</p>
          <p className="text-xs text-gray-500">Tip: Try 7%</p>
        </div>
        <div className="text-sm px-3 py-1 bg-white border rounded-full shadow-sm">{weekendPremiumPercent}%</div>
      </div>

      {/* Range slider with dynamic background */}
      <input
        type="range"
        min={basePrice}
        max={maxPrice}
        value={weekendPrice}
        onChange={handleSliderChange}
        style={{
          background: `linear-gradient(to right, black 0%, black ${progressPercent}%, #ddd ${progressPercent}%, #ddd 100%)`,
        }}
        className="w-full custom-slider"
      />

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0%</span>
        <span>99%</span>
      </div>

      <div className="mt-6 border rounded-md p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Base price</span>
          <span>₹{weekendPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Guest service fee</span>
          <span>₹{guestServiceFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Guest price before taxes</span>
          <span>₹{guestPriceBeforeTaxes.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4 border rounded-md p-4 bg-gray-50 flex justify-between text-sm font-medium">
        <span>You earn</span>
        <span>₹{hostEarnings.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default WeekendPrice;
