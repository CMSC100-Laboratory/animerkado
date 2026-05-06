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

export default function ProductForm({ initialData, onSubmit, onCancel, fetchProducts }) {
  const [form, setForm] = useState(initialForm);
  const [imageMode, setImageMode] = useState("url");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setForm(initialData || initialForm);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value ?? "",
    });
  };

  const getToken = () => localStorage.getItem("token"); // adjust if needed

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
          Authorization: `Bearer ${getToken()}`,
        },
      };

      if (imageMode === "upload") {
     const body = new FormData();

        body.append("productImage", imageFile); 
        body.append("productName", form.productName);
        body.append("productType", form.productType);
        body.append("price", form.price);
        body.append("productQuantity", form.productQuantity);
        body.append("productDescription", form.productDescription);
        options.body = body;
      } else {
        options.headers["Content-Type"] = "application/json";

        options.body = JSON.stringify({
          productName: form.productName || "",
          productType: form.productType || "",
          price: Number(form.price || 0),
          productQuantity: Number(form.productQuantity || 0),
          productDescription: form.productDescription || "",
          imageUrl: form.imageUrl || "",
        });
      }

      const res = await fetch(url, options);

      if (!res.ok) {
        const errText = await res.text();
        console.error("Server error:", errText);
        return;
      }

      const data = await res.json();
      console.log(data);

      setForm(initialForm);
      setImageFile(null);
      setImageMode("url");

      if (fetchProducts) fetchProducts();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <form onSubmit={handleSubmit}>
        <input name="productName" value={form.productName ?? ""} onChange={handleChange} placeholder="Name" />
        <input name="productType" value={form.productType ?? ""} onChange={handleChange} placeholder="Type" />
        <input name="price" value={form.price ?? ""} onChange={handleChange} placeholder="Price" />
        <input name="productQuantity" value={form.productQuantity ?? ""} onChange={handleChange} placeholder="Quantity" />
        <input name="productDescription" value={form.productDescription ?? ""} onChange={handleChange} placeholder="Description" />

        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

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