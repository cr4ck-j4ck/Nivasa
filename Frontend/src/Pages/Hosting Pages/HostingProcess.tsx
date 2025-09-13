import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GetStarted from "./HostIntro";
import TellUsAboutYourPlace from "./TellUsAboutYourPlace";
import ChoosePropertyType from "./ChoosePropertyType";
import PlaceType from "./TypeOfPlace";
import Address from "@/Forms/ConfirmAddressForm";
import PropertyCapacity from "./PropertyCapacity";
import firstStepVideo from "@/assets/first.mp4";
import secondStepVideo from "@/assets/second.mp4";
import thirdStepVideo from "@/assets/first.mp4";
import ChooseAmenities from "./ChooseAmenities";
import PhotoUpload from "./PhotoUpload";
import ImageReorderer from "./ReArrangeImages";
import PropertyTitleInput from "./PropertyTitleAndDescription";
import PropertyTag from "./PropertyTag";
import WeekdayBasePrice from "./WeekDayBasePrice";
import WeekendPrice from "./WeekendPrice";
import { useHostingProcessStore } from "@/Store/HostingProcessStore";
import LoadingScreen from "@/Components/HostingProcess/LoadingScreen";
import SuccessScreen from "@/Components/HostingProcess/SuccessScreen";
import { createListing, fileToBase64, type CreateListingData } from "@/Services/listingService";
export default function HostingProcess() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("uploading");
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdListingId, setCreatedListingId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  
  const { validateStep, listingInfo, address, coordinates, images, reset } = useHostingProcessStore();

  const ElementsArray = [
    <GetStarted key="get-started" />,
    <TellUsAboutYourPlace
      key="step-one"
      Heading="Tell us about your place"
      Description="In this step, we'll ask you which type of property you have and if
                guests will book the entire place or just a room. Then let us know
                the location and how many guests can stay."
      step={1}
      video={firstStepVideo}
    />,
    <ChoosePropertyType key={"step-two"} />,
    <PlaceType key={"step-three"} />,
    <Address key={"step-four"} />,
    <PropertyCapacity key={"step-five"} />,
    <TellUsAboutYourPlace
      key="step-six"
      step={2}
      Heading="Make your place stand out"
      Description="In this step, you'll add some of the amenities your place offers, plus 5 or more photos. Then you'll create a title and description."
      video={secondStepVideo}
    />,
    <ChooseAmenities key="step-seven" />,
    <PhotoUpload nextFunc={setStep} key="step-eight" />,
    <ImageReorderer key="step-nine" />,
    <PropertyTitleInput
      key="step-ten"
      heading={`Now, let's give your ${listingInfo.propertyType} a title`}
      placeholder="Enter a catchy title..."
      midHeading="Short titles work best. Have fun with it – you can always change it later."
      textLimit={32}
    />,
    <PropertyTitleInput
      key="step-eleven"
      heading="Create your description"
      placeholder="Write a description which highlights your space and what makes it unique..."
      midHeading="Share what makes your place special"
      textLimit={32}
    />,
    <PropertyTag key="step-twelve" />,
    <TellUsAboutYourPlace
      key="step-tweleve"
      Heading="Finish up and publish"
      Description="Finally, you'll choose booking settings, set up pricing and publish your listing.."
      step={3}
      video={thirdStepVideo}
    />,
    <WeekdayBasePrice key="step-thirteen" />,
    <WeekendPrice key="step-fourteen" />,
  ];
  // Calculate progress percentage
  const progressPercentage = ((step + 1) / ElementsArray.length) * 100;

  // Get validation for current step
  const currentStepValidation = validateStep(step);
  const canProceed = currentStepValidation.isValid;
  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };
  const handleCreateListing = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate all required data
      if (!address || !coordinates || !listingInfo.title || !listingInfo.description || 
          !listingInfo.propertyType || images.length < 5) {
        throw new Error("Missing required information. Please complete all steps.");
      }

      // Step 1: Upload images
      setLoadingStep("uploading");
      const base64Images: string[] = [];
      
      for (const image of images) {
        const base64 = await fileToBase64(image.file);
        base64Images.push(base64);
      }

      // Step 2: Process images
      setLoadingStep("processing");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

      // Step 3: Set location
      setLoadingStep("location");
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 4: Create listing
      setLoadingStep("creating");
      
      const listingData: CreateListingData = {
        title: listingInfo.title,
        description: listingInfo.description,
        propertyType: listingInfo.propertyType,
        typeOfPlace: listingInfo.typeOfPlace,
        highlight: listingInfo.highlight,
        address: {
          flatHouse: address.flatHouse,
          streetAddress: address.streetAddress!,
          landmark: address.landmark,
          district: address.district,
          city: address.city!,
          state: address.state!,
          postalCode: address.postalCode!,
          country: address.country || "India",
        },
        coordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng,
        },
        capacity: {
          guests: listingInfo.capacity.guests!,
          bedrooms: listingInfo.capacity.bedrooms!,
          beds: listingInfo.capacity.beds!,
          bathrooms: listingInfo.capacity.bathrooms!,
        },
        amenities: listingInfo.amenities,
        pricing: {
          weekdayPrice: listingInfo.pricing.weekdayPrice,
          weekendPrice: listingInfo.pricing.weekendPrice,
        },
        images: base64Images,
      };

      const response = await createListing(listingData);

      // Step 5: Finalize
      setLoadingStep("finalizing");
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsLoading(false);
      setCreatedListingId(response.listing?._id);
      setShowSuccess(true);
      
      // Reset the store after successful creation
      reset();
      
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error.message : "Failed to create listing");
      console.error("Error creating listing:", error);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setCreatedListingId(undefined);
  };

  const handleRetry = () => {
    setError(null);
    handleCreateListing();
  };
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    setDirection(1);
    setStep((state) => Math.min(state + 1, ElementsArray.length - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((state) => Math.max(state - 1, 0));
  };
  return (
    <>
      <div className="relative overflow-visible max-h-[100vh] flex items-center">
        <div className="fixed top-0 left-0 bg-white HostProcessNav">
          <header className="flex items-center justify-between p-6 w-[100vw]">
            <img
              src="/Nivasa-removebg-preview.png"
              alt="Nivasa Logo"
              className="h-25"
            />
            <button className="exitButton relative z-12">Exit</button>
          </header>
        </div>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-fit w-full"
          >
            {ElementsArray[step]}
          </motion.div>
        </AnimatePresence>

      <footer className="w-[100vw] h-24 flex flex-col fixed bottom-0 left-0 bg-white border-t border-gray-200 z-10">
        {/* Progress Bar */}
        <div className="w-[100vw] h-2 bg-gray-200 relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gray-800 to-black"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        <div className="items-center flex justify-between w-full h-full px-10">
          <div
            className={`font-semibold underline text-lg cursor-pointer transition-opacity duration-300 ${
              step === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
            onClick={step > 0 ? prevStep : undefined}
          >
            Back
          </div>

          <div className="flex items-center gap-4">
            {/* Validation message */}
            {!canProceed && currentStepValidation.requiredFields.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-gray-500 italic"
              >
                Please complete all required fields
              </motion.div>
            )}

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-500 italic flex items-center space-x-2"
              >
                <span>{error}</span>
                <button
                  onClick={handleRetry}
                  className="text-xs underline hover:no-underline"
                >
                  Retry
                </button>
              </motion.div>
            )}

            <button
              className={`px-7 py-3 rounded-md font-medium transition-all duration-300 ${
                canProceed && !isLoading
                  ? "text-white bg-[#232323] hover:bg-[#1a1a1a] transform hover:scale-105"
                  : "text-gray-400 bg-gray-200 !cursor-not-allowed"
              }`}
              onClick={canProceed && !isLoading ? (step !== ElementsArray.length - 1? nextStep : handleCreateListing) : undefined}
              disabled={!canProceed || isLoading}
            >
              {isLoading ? "Creating..." : step === ElementsArray.length - 1 ? "Create Listing" : "Next"}
            </button>
          </div>
        </div>
      </footer>
      </div>

      {/* Loading Screen */}
      {isLoading && <LoadingScreen currentStep={loadingStep} />}

      {/* Success Screen */}
      {showSuccess && (
        <SuccessScreen 
          listingId={createdListingId} 
          onClose={handleCloseSuccess} 
        />
      )}
    </>
  );
}
