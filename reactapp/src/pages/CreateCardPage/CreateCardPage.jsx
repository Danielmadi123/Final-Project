import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CardForm from "../CreateCardPage/CardForm";
import ROUTES from "../../routes/ROUTES";
import { useNavigate } from "react-router-dom";

const CreateCardPage = () => {
  const navigate = useNavigate();

  const [inputsValue, setInputsValue] = useState({
    title: "",
    subtitle: "",
    description: "",
    brand: "",
    price: "",
    shipping: "free",
    images: [{ url: "", alt: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    subtitle: "",
    description: "",
    brand: "",
    price: "",
    shipping: "",
    url: "",
    alt: "",
  });

  const brandOptions = [
    { label: "Select Brand", value: "" },
    { label: "Apple", value: "Apple" },
    { label: "LG", value: "LG" },
    { label: "Microsoft", value: "Microsoft" },
    { label: "Samsung", value: "Samsung" },
  ];

  const maxImages = 6; // Set the maximum number of images

  const fields = [
    { id: "title", label: "Title", required: true },
    { id: "subtitle", label: "SubTitle", required: true },
    { id: "description", label: "Description", required: true },
    { id: "brand", label: "Brand", required: true, options: brandOptions },
    { id: "price", label: "Price", required: true },
    { id: "shipping", label: "Shipping", required: true },
    { id: "images", label: "Images", required: false },
  ];

  const handleInputChange = (e, index, fieldId) => {
    const { id, value } = e.target;

    setInputsValue((currentState) => {
      if (id && (id.startsWith("url-") || id.startsWith("alt-"))) {
        const [field, idx] = id.split("-");
        const i = parseInt(idx, 10);

        return {
          ...currentState,
          images: currentState.images.map((img, imgIndex) =>
            imgIndex === index ? { ...img, [field]: value } : img
          ),
        };
      } else if (fieldId) {
        // Handle brand field change
        return {
          ...currentState,
          [fieldId]: value,
        };
      } else {
        return {
          ...currentState,
          [id]: value,
        };
      }
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: value.trim() === "" ? `${id} is required` : "",
    }));
  };

  const handleAddField = () => {
    if (inputsValue.images.length < maxImages) {
      setInputsValue((prevState) => ({
        ...prevState,
        images: [...prevState.images, { url: "", alt: "" }],
      }));
    }
  };

  const handleRemoveField = (indexToRemove) => {
    setInputsValue((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error !== "")) {
      toast.error("Please fill in all required fields correctly.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setLoading(true);

    try {
      const price = parseFloat(inputsValue.price);
      const { data } = await axios.post("http://localhost:8080/cards", {
        title: inputsValue.title,
        subtitle: inputsValue.subtitle,
        description: inputsValue.description,
        brand: inputsValue.brand,
        price: price,
        shipping: inputsValue.shipping,
        images: inputsValue.images.map((image) => ({
          url: image.url,
          alt: image.alt || undefined,
        })),
      });

      toast.success("You've created a business card!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate(ROUTES.MYCARDS);
    } catch (err) {
      console.error("Error creating card:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardForm
      fields={fields}
      inputsValue={inputsValue}
      errors={errors}
      loading={loading}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      handleAddField={handleAddField}
      handleRemoveField={handleRemoveField}
    />
  );
};

export default CreateCardPage;
