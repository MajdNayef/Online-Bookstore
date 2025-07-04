import { AiOutlineClose } from "react-icons/ai";
import { PiBookOpenTextLight } from "react-icons/pi";
import { BiUserCircle } from "react-icons/bi";

const BookModal = ({ book, onClose }) => {
  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[600px] max-w-full h-auto bg-white rounded-xl p-6 flex flex-col relative shadow-lg"
      >
        <AiOutlineClose
          className="absolute right-6 top-6 text-3xl text-red-600 cursor-pointer hover:text-red-400 transition-colors duration-200"
          onClick={onClose}
        />
        <h2 className="w-fit px-4 py-1 bg-red-300 rounded-lg text-sm font-semibold">
          {book.publishYear}
        </h2>
        <h4 className="my-2 text-gray-500 text-xs">{book._id}</h4>
        <div className="flex justify-start items-center gap-x-2">
          <PiBookOpenTextLight className="text-red-300 text-2xl" />
          <h2 className="my-1 font-medium">{book.title}</h2>
        </div>
        <div className="flex justify-start items-center gap-x-2">
          <BiUserCircle className="text-red-300 text-2xl" />
          <h2 className="my-1 font-medium">{book.author}</h2>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          Anything you want to show
        </p>
        <p className="my-2 text-sm text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa,
          corporis molestias aliquid quia vel itaque non quae libero molestiae,
          veniam voluptas, id quasi error nulla debitis rem minima similique
          corrupti.
        </p>
      </div>
    </div>
  );
};

export default BookModal;
