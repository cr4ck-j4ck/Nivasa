import leftLeaf from "@/assets/leftleaf.avif";
import rightLeaf from "@/assets/rightLeaf.avif";
import "./review.css";
import StarIcon from "@mui/icons-material/Star";

export default function () {
  const arr = [1, 2, 3, 4, 5, 6];
  return (
    <div className="review mt-10">
      <div className="rating flex justify-center w-full">
        <div className="leftLeaf">
          <img src={leftLeaf} alt="Image" className="h-[8rem]" />
        </div>
        <h1 className="text-8xl text-[#222222] reviewHead">5.0</h1>
        <div className="leftLeaf">
          <img src={rightLeaf} alt="Image" className="h-[8rem]" />
        </div>
      </div>
      <div className="reviewsIcons h-40 pb-10 pl-5 flex max-w-[66rem] 9kl:overflow-x-hidden overflow-x-auto mx-auto overflow-y-hidden mb-10 box-border">
        <div className="reviewDiv cleanliness flex-1">
          <div className="detail pt-2 font-semibold pl-8">
            <p className="text-md ">Cleanliness</p>
            <p className="text-lg">4.9</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="40px"
            viewBox="0 -960 960 960"
            fill="#000000"
            className="mt"
          >
            <path d="m360-680 40-80v-40h-40v-80h240q17 0 28.5 11.5T640-840v40l-40 80H480v-40l-80 80h-40ZM320-80v-274q0-11 3.5-23.5T332-400l148-280h120q14 14 27 37.5t13 42.5v520H320Zm80-80h160v-440h-32L400-356v196Zm0 0h160-160Z" />
          </svg>
        </div>
        <div className="reviewDiv flex-1">
          <div className="detail pt-2 font-semibold pl-6">
            <p className="text-md ">Accuracy</p>
            <p className="text-lg">5.0</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            fill="#000000"
          >
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z" />
          </svg>
        </div>
        <div className="reviewDiv flex-1">
          <div className="detail pt-2 font-semibold pl-6">
            <p className="text-md ">Check-in</p>
            <p className="text-lg">5.0</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="40px"
            viewBox="0 -960 960 960"
            width="40px"
            fill="#000000"
            className="rotate-45 -mb-2"
          >
            <path d="M280-408q-29.67 0-50.83-21.17Q208-450.33 208-480q0-29.67 21.17-50.83Q250.33-552 280-552q29.67 0 50.83 21.17Q352-509.67 352-480q0 29.67-21.17 50.83Q309.67-408 280-408Zm0 168q-100 0-170-70T40-480q0-100 70-170t170-70q70.33 0 124.5 33.67 54.17 33.66 85.5 97.66h354.67L960-473.33l-171.33 162L703.33-374 618-311.33l-78.33-60H490q-27.33 58-81.17 94.66Q355-240 280-240Zm0-66.67q57.33 0 104.17-37Q431-380.67 445-438h117.67L618-394.33l86-62.34L782.33-397 864-474.67 816.67-522H445q-12.67-54.67-58.83-93Q340-653.33 280-653.33q-72 0-122.67 50.66Q106.67-552 106.67-480t50.66 122.67Q208-306.67 280-306.67Z" />
          </svg>
        </div>
        <div className="reviewDiv flex-1">
          <div className="detail pt-2 font-semibold pl-6">
            <p className="text-md ">Communication</p>
            <p className="text-lg">5.0</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32px"
            viewBox="0 -960 960 960"
            width="32px"
            fill="#000000"
            className="-mb-2"
          >
            <path d="M80-80v-733.33q0-27 19.83-46.84Q119.67-880 146.67-880h666.66q27 0 46.84 19.83Q880-840.33 880-813.33v506.66q0 27-19.83 46.84Q840.33-240 813.33-240H240L80-80Zm131.33-226.67h602v-506.66H146.67v575l64.66-68.34Zm-64.66 0v-506.66 506.66Z" />
          </svg>
        </div>
        <div className="reviewDiv flex-1">
          <div className="detail pt-2 font-semibold pl-6">
            <p className="text-md ">Location</p>
            <p className="text-lg">5.0</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="40px"
            viewBox="0 -960 960 960"
            width="40px"
            fill="#000000"
            className="-mb-2"
          >
            <path d="M638.67-527.33v-1 1-168 168ZM171.33-138.67q-18 8.67-34.66-2.16Q120-151.67 120-172v-558.67q0-13 7.5-23t19.83-15L352.67-840 608-750.67 788.67-822q18-8 34.66 2.5Q840-809 840-788.67v371q-12.33-21.66-29.17-39.66-16.83-18-37.5-32v-257.34l-134.66 51.34v168q-17.67 1.33-34.34 4.5-16.66 3.16-32.33 8.83v-181.33L388-758v534.33l-216.67 85ZM186.67-214l134.66-51.33V-758l-134.66 44.67V-214Zm462.66-7.33q36.67 0 61.5-24 24.84-24 25.17-62.67.33-36.67-24.83-61.67-25.17-25-61.84-25-36.66 0-61.66 25t-25 61.67q0 36.67 25 61.67t61.66 25Zm0 66.66q-63.33 0-108.33-45T496-308q0-64 45-108.67 45-44.66 108.33-44.66 64 0 108.67 44.66Q802.67-372 802.67-308q0 23-6.17 43.83-6.17 20.84-17.83 38.84L880-124l-44 44-101.33-100.67q-18.67 13-39.84 19.5-21.16 6.5-45.5 6.5ZM321.33-758v492.67V-758Z" />
          </svg>
        </div>
        <div className="flex-1 h-full relative min-w-[7rem] max-w-[120px]">
          <div className="detail pt-2 font-semibold pl-6">
            <p className="text-md ">Value</p>
            <p className="text-lg">5.0</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="40px"
            viewBox="0 -960 960 960"
            width="40px"
            fill="#000000"
            className="mb-3 absolute top-20 left-5"
          >
            <path d="m860.67-399.33-299.34 300q-10 9.66-22.5 14.5-12.5 4.83-25 4.83T489-85q-12.33-5-22.33-14.33L99.67-467q-9-9-14.34-21.14Q80-500.27 80-513.67v-299.66q0-27.5 19.58-47.09Q119.17-880 146.67-880H447q13.38 0 25.92 5.42 12.55 5.41 21.75 14.58l366 366.33q10.26 10 14.96 22.5 4.7 12.5 4.7 25t-4.83 25q-4.83 12.5-14.83 21.84ZM515-145.33l299.33-300-367.66-368h-300v298l368.33 370ZM250-656q22.33 0 38.5-16.17 16.17-16.16 16.17-38.5 0-22.33-16.17-38.5-16.17-16.16-38.5-16.16t-38.5 16.16q-16.17 16.17-16.17 38.5 0 22.34 16.17 38.5Q227.67-656 250-656Zm230.67 176.67Z" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10 xl:w-[90%] mx-auto">
        {arr.map((el) => (
          <div className="reviewUserInfo max-w-[500px]">
            <div className="flex">
              <img
                src="https://res.cloudinary.com/dscntdruu/image/upload/v1750431885/Dream_opyfuf.jpg"
                alt="Dream's Image"
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="ml-[0.8rem]">Dream</p>
                <p className="ml-[0.8rem]">7 years on Airbnb</p>
              </div>
            </div>
            <div className="starIcons flex mt-3">
              <StarIcon sx={{ fontSize: 11 }} />
              <StarIcon sx={{ fontSize: 11 }} />
              <StarIcon sx={{ fontSize: 11 }} />
              <StarIcon sx={{ fontSize: 11 }} />
              <StarIcon sx={{ fontSize: 11 }} />
            </div>
            <p className="reviewDesc mt-1">
              He was awesome host, worth staying there, 10 mins distance from mahakaleshwar.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
