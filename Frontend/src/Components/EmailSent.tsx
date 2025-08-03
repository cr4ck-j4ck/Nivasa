import { MdOutlineCheckCircleOutline } from 'react-icons/md';

const EmailSent = () => {
  return (
    <>
      <style>
        {`
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.85) translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .animate-popIn {
            animation: popIn 0.5s ease-out forwards;
          }
        `}
      </style>

      <div className="w-full h-15 mt-5 bg-green-100 border-l-4 border-green-500 text-green-700 flex items-center px-4 rounded-md shadow-md animate-popIn">
        <MdOutlineCheckCircleOutline className="h-6 w-6 text-green-500 mr-3" />
        <p className="text-sm sm:text-base font-medium">
          Verification link sent to your email. Check your inbox or spam.
        </p>
      </div>
    </>
  );
};

export default EmailSent;
