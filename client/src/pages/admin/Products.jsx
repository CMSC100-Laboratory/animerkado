import React, { useEffect, useState } from "react";

const api_url = "http://localhost:5000/api/products";

const initialForm = {
  productName: "",
  productType: "",
  price: "",
  productQuantity: "",
  productDescription: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("");

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
      setProducts(data.products || data);
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

  // ================= ADD =================
  const addProduct = async () => {
    try {
      await fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });

      setForm(initialForm);
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // ================= UPDATE =================
  const updateProduct = async () => {
    try {
      await fetch(`${api_url}/${form._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });

      setForm(initialForm);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    try {
      await fetch(`${api_url}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (form._id) {
      updateProduct();
    } else {
      addProduct();
    }
  };

  // ================= EDIT =================
  const handleEdit = (product) => {
    setForm(product);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      {/* SORT */}
      <div>
        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="productName">Name</option>
          <option value="productType">Type</option>
          <option value="price">Price</option>
          <option value="productQuantity">Quantity</option>
        </select>

        <select onChange={(e) => setOrder(e.target.value)}>
          <option value="">Order</option>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>

        <button onClick={() => fetchProducts(sort, order)}>
          Apply
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input name="productName" value={form.productName} onChange={handleChange} placeholder="Name" />
        <input name="productType" value={form.productType} onChange={handleChange} placeholder="Type" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
        <input name="productQuantity" value={form.productQuantity} onChange={handleChange} placeholder="Quantity" />
        <input name="productDescription" value={form.productDescription} onChange={handleChange} placeholder="Description" />

        <button type="submit">
          {form._id ? "Update" : "Add"}
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
            <tr key={p._id}>
              <td>{p.productName}</td>
              <td>{p.productType}</td>
              <td>{p.price}</td>
              <td>{p.productQuantity}</td>
              <td>{p.productDescription}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => deleteProduct(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}