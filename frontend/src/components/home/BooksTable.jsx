import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";

const BooksTable = ({ books }) => {
  return (
    <table className="w-full border-separate border-spacing-2 text-sm text-gray-700">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-slate-600 rounded-md px-4 py-2">No</th>
          <th className="border border-slate-600 rounded-md px-4 py-2">Title</th>
          <th className="border border-slate-600 rounded-md px-4 py-2 max-md:hidden">
            Author
          </th>
          <th className="border border-slate-600 rounded-md px-4 py-2 max-md:hidden">
            Publish Year
          </th>
          <th className="border border-slate-600 rounded-md px-4 py-2">Operations</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
          <tr
            key={book._id}
            className="h-8 hover:bg-gray-100 transition-colors duration-200"
          >
            <td className="border border-slate-700 rounded-md text-center px-2">
              {index + 1}
            </td>
            <td className="border border-slate-700 rounded-md text-center px-2">
              {book.title}
            </td>
            <td className="border border-slate-700 rounded-md text-center px-2 max-md:hidden">
              {book.author}
            </td>
            <td className="border border-slate-700 rounded-md text-center px-2 max-md:hidden">
              {book.publishYear}
            </td>
            <td className="border border-slate-700 rounded-md text-center px-2">
              <div className="flex justify-center gap-x-4">
                <Link to={`/books/details/${book._id}`}>
                  <BsInfoCircle className="text-2xl text-green-800 hover:text-green-600" />
                </Link>
                <Link to={`/books/edit/${book._id}`}>
                  <AiOutlineEdit className="text-2xl text-yellow-600 hover:text-yellow-400" />
                </Link>
                <Link to={`/books/delete/${book._id}`}>
                  <MdOutlineDelete className="text-2xl text-red-600 hover:text-red-400" />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BooksTable;
