import React, { useState, useRef, useEffect } from "react";

const MIN_PRICE = 876;
const MAX_PRICE = 875165;

const GUEST_SERVICE_FEE_RATE = 0.14; // 14%
const HOST_SERVICE_FEE_RATE = 0.03; // 3%

const formatIN = (num: number): string =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num);

const WeekdayPriceInput: React.FC = () => {
  const [price, setPrice] = useState<number>(1575);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(price.toString());
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse live input value or fallback to `price`
  const parsedInputValue = parseInt(inputValue.replace(/\D/g, ""), 10);
  const currentValue = !isNaN(parsedInputValue) ? parsedInputValue : price;

  // Derived values (live)
  const guestServiceFee = Math.round(currentValue * GUEST_SERVICE_FEE_RATE);
  const guestPrice = currentValue + guestServiceFee;
  const youEarn = Math.round(currentValue * (1 - HOST_SERVICE_FEE_RATE));

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    if (
      isNaN(parsedInputValue) ||
      parsedInputValue < MIN_PRICE ||
      parsedInputValue > MAX_PRICE
    ) {
      setError(
        `Please enter a base price between ₹${formatIN(
          MIN_PRICE
        )} and ₹${formatIN(MAX_PRICE)}.`
      );
    } else {
      setPrice(parsedInputValue);
      setError("");
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length > MAX_PRICE.toString().length) return;
    setInputValue(raw);
  };

  const handleClick = () => {
    setInputValue(price.toString());
    setIsEditing(true);
  };
  return (
    <div className="min-h-screen bg-white w-[100vw] flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full py-10">
        <h2 className="text-2xl weekdayPriceHead">
          Now, set a weekday base price
        </h2>

        {/* Price Display or Input */}
        <div className="mt-10 mb-2 text-9xl showHead font-extrabold flex justify-center items-center mx-auto">
          ₹
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={handleChange}
              onBlur={handleBlur}
              className="text-center inDekh showHead border-none outline-none"
              style={{
                fontVariantNumeric: "tabular-nums",
                WebkitAppearance: "none",
                width: `${inputValue.length * 5}rem`,
              }}
            />
          ) : (
            <span onClick={handleClick} className="cursor-pointer">
              {formatIN(price)}
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm mt-2 flex items-center justify-center gap-2">
            <span>❗</span> {error}
          </p>
        )}

        {/* Toggle Guest Price Breakdown */}
        <div className="relative w-full max-w-md mx-auto">
          <div>
            <button
            className="text-lg text-gray-600 text-center w-full mt-3 "
            onClick={() => setShowDetails(!showDetails)}
          >
            Guest price before taxes ₹{formatIN(guestPrice)}{" "}
            {showDetails ? "▲" : "▼"}
          </button>
          </div>

          {/* Price Breakdown */}
          {showDetails && (
            <div className="mt-2 border rounded-xl p-4 text-left shadow-md z-10 relative">
              <div className="flex justify-between mb-1">
                <span>Base price</span>
                <span>₹{formatIN(currentValue)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Guest service fee (14%)</span>
                <span>₹{formatIN(guestServiceFee)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Guest price before taxes</span>
                <span>₹{formatIN(guestPrice)}</span>
              </div>
            </div>
          )}
        </div>

        {/* You earn */}
        <div className="mt-4 border rounded-xl px-4 py-2 text-left w-full max-w-md mx-auto font-medium">
          <div className="flex justify-between">
            <span>You earn (after 3% host fee)</span>
            <span>₹{formatIN(youEarn)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekdayPriceInput;
