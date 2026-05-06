import { useState, useEffect } from "react";

const initialForm = {
  productId: "",
  productName: "",
  productType: "",
  price: "",
  productQuantity: "",
  productDescription: "",
};

export default function ProductForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [imageMode, setImageMode] = useState("url"); 
// "url" or "file"

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <form onSubmit={handleSubmit}>
        <input name="productName" value={form.productName} onChange={handleChange} placeholder="Name" />
        <input name="productType" value={form.productType} onChange={handleChange} placeholder="Type (1/2)" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
        <input name="productQuantity" value={form.productQuantity} onChange={handleChange} placeholder="Quantity" />
        <input name="productDescription" value={form.productDescription} onChange={handleChange} placeholder="Description" />

        <button type="submit">
          {form.productId ? "Update" : "Add"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}