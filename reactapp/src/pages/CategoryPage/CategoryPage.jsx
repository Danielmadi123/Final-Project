import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/categories/get-all-categories",
        {
          headers: {
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const createNewCategory = async () => {
    try {
      await axios.post(
        "http://localhost:8080/categories/create-new-category",
        {
          name: newCategoryName,
        },
        {
          headers: {
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
            "Content-Type": "application/json",
          },
        }
      );
      getAllCategories();
    } catch (error) {
      console.error("Error creating new category:", error);
    }
  };

  const editCategory = async (categoryId) => {
    try {
      await axios.put(
        `http://localhost:8080/categories/${categoryId}`,
        {
          name: updatedCategoryName,
        },
        {
          headers: {
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
            "Content-Type": "application/json",
          },
        }
      );
      getAllCategories();
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  return (
    <div>
      <h1>Category Page</h1>


      <ul>
        {categories.map((category) => (
          <li key={category._id}>{category.name}</li>
        ))}
      </ul>


      <div>
        <h2>Create New Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={createNewCategory}>Create</button>
      </div>

      <div>
        <h2>Edit Category</h2>
        <select onChange={(e) => setUpdatedCategoryName(e.target.value)}>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={() => editCategory(categories[0]._id)}>Edit</button>
      </div>
    </div>
  );
};

export default CategoryPage;
