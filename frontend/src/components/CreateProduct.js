import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import '../styles/CreateProduct.css';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [infoFields, setInfoFields] = useState([{ name: '', value: '' }]);
  const [images, setImages] = useState([]);

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
  };

  const handleAddInfoField = () => {
    setInfoFields([...infoFields, { name: '', value: '' }]);
  };

  const handleRemoveInfoField = (index) => {
    const updatedInfo = infoFields.filter((_, i) => i !== index);
    setInfoFields(updatedInfo);
  };

  const handleInfoChange = (index, field, value) => {
    const updatedInfo = [...infoFields];
    updatedInfo[index][field] = value;
    setInfoFields(updatedInfo);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('subcategory', subCategory);
    formData.append('rating', rating);

    images.forEach((image) => formData.append('images', image));
    formData.append('info', JSON.stringify(infoFields));

    try {
      await axios.post('/products/create-product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product created successfully');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <form className="create-product-form" onSubmit={handleSubmit}>
      <h2>Create New Product</h2>
      <div className="form-group">
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Subcategory:</label>
        <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required>
          <option value="">Select Subcategory</option>
          {categories.find((cat) => cat.name === category)?.subcategories.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Rating:</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={rating >= star ? 'star selected' : 'star'}
              onClick={() => setRating(star)}
            >
              &#9733;
            </span>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Images:</label>
        <input type="file" multiple onChange={handleImageUpload} />
      </div>

      <div className="form-group">
        <label>Product Info:</label>
        {infoFields.map((info, index) => (
          <div key={index} className="info-field">
            <input
              type="text"
              placeholder="Name"
              value={info.name}
              onChange={(e) => handleInfoChange(index, 'name', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Value"
              value={info.value}
              onChange={(e) => handleInfoChange(index, 'value', e.target.value)}
              required
            />
            <button
              type="button"
              className="delete-info-btn"
              onClick={() => handleRemoveInfoField(index)}
            >
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddInfoField}>+</button>
      </div>

      <button type="submit" className="submit-button">Create Product</button>
    </form>
  );
};

export default CreateProduct;
