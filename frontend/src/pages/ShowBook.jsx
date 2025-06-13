// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const ShowBook = () => {
  const [book, setBooks] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/books/${id}`)
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Show Book</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border border-gray-300 rounded-2xl w-fit p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-sky-50">
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-600">Id:</span>
            <span className="text-gray-800 ml-2">{book._id}</span>
          </div>
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-600">Title:</span>
            <span className="text-gray-800 ml-2">{book.title}</span>
          </div>
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-600">Author:</span>
            <span className="text-gray-800 ml-2">{book.author}</span>
          </div>
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-600">Publish Year:</span>
            <span className="text-gray-800 ml-2">{book.publishYear}</span>
          </div>
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-600">Create Time:</span>
            <span className="text-gray-800 ml-2">{new Date(book.createdAt).toLocaleString()}</span>
          </div>
          <div className="my-4">
            <span className="text-lg font-semibold text-gray-600">Last Update Time:</span>
            <span className="text-gray-800 ml-2">{new Date(book.updateAt).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBook;
