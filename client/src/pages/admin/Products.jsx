import { useState, useEffect } from "react";

const initialForm = {
  productId: "",
  productName: "",
  productType: "",
  price: "",
  productQuantity: "",
  productDescription: "",
  imageUrl: "",
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

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const isEdit = !!form.productId;

    const url = isEdit
      ? `http://localhost:5000/api/products/${form.productId}`
      : "http://localhost:5000/api/products";

    let options = {
      method: isEdit ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };

    let body;

    if (imageMode === "upload") {
      body = new FormData();

      body.append("productName", form.productName || "");
      body.append("productType", form.productType || "");
      body.append("price", form.price || "");
      body.append("productQuantity", form.productQuantity || "");
      body.append("productDescription", form.productDescription || "");

      if (imageFile) {
        body.append("image", imageFile);
      }

      options.body = body;
    } else {
      options.headers["Content-Type"] = "application/json";

     options.body = JSON.stringify({
      productName: form.productName || "",
      productType: Number(form.productType),
      price: Number(form.price),
      productQuantity: Number(form.productQuantity),
      productDescription: form.productDescription || "",
      imageUrl: form.imageUrl || ""
    });
    }

    const res = await fetch(url, options);

  
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Backend did not return JSON:", text);
      return;
    }

    console.log(data);

    setForm(initialForm);
    setImageFile(null);
    setImageMode("url"); // reset mode
    fetchProducts();

  } catch (err) {
    console.error(err);
  }
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