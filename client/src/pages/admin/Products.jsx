import React, { useEffect, useState } from "react";

const api_url = "http://localhost:5000/api/products";

const initialForm = {
  productId: "",
  productName: "",
  productType: "",
  price: "",
  productQuantity: "",
  productDescription: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);

  const getToken = () => localStorage.getItem("token");

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async (sortField = "", sortOrder = "") => {
    try {
      let url = api_url;

      if (sortField && sortOrder) {
        url += `?sort=${sortField}&order=${sortOrder}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      setProducts(data);

    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD PRODUCT =================
  const addProduct = async () => {
    try {
      const payload = {
        productId: crypto.randomUUID(),
        productName: form.productName,
        productType: form.productType,
        price: form.price,
        productQuantity: form.productQuantity,
        productDescription: form.productDescription,
      };

      const res = await fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.inserted) {
        setForm(initialForm);
        fetchProducts();
      } else {
        console.error("Insert failed:", data.error);
      }

    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // ================= UPDATE PRODUCT =================
  const updateProduct = async () => {
    try {
      const res = await fetch(
        `${api_url}/${form.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      console.log("UPDATE RESPONSE:", data);

      setForm(initialForm);
      fetchProducts();

    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // ================= DELETE PRODUCT =================
  const deleteProduct = async (productId) => {
    try {
      const res = await fetch(`${api_url}/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      console.log("DELETE RESPONSE:", data);

      fetchProducts();

    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.productId) {
      updateProduct();
    } else {
      addProduct();
    }
  };

  // ================= EDIT =================
  const handleEdit = (product) => {
    setForm({
      productId: product.productId,
      productName: product.productName,
      productType: product.productType,
      price: product.price,
      productQuantity: product.productQuantity,
      productDescription: product.productDescription,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="productName"
          value={form.productName}
          onChange={handleChange}
          placeholder="Name"
        />

        <input
          name="productType"
          value={form.productType}
          onChange={handleChange}
          placeholder="Type"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
        />

        <input
          name="productQuantity"
          value={form.productQuantity}
          onChange={handleChange}
          placeholder="Quantity"
        />

        <input
          name="productDescription"
          value={form.productDescription}
          onChange={handleChange}
          placeholder="Description"
        />

        <button type="submit">
          {form.productId ? "Update" : "Add"}
        </button>
      </form>

      {/* TABLE */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.productId}>
              <td>{p.productName}</td>
              <td>{p.productType}</td>
              <td>{p.price}</td>
              <td>{p.productQuantity}</td>
              <td>{p.productDescription}</td>
              <td>
                <button type="button" onClick={() => handleEdit(p)}>
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteProduct(p.productId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}