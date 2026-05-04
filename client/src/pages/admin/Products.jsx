import { useState, useEffect} from 'react'

const api_url = "http://localhost:5000/api/products";

const initialForm = {
    productName:"",
    productType:"",
    price:"",
    productQuantity:"",
    productDescription:"",
};



export default function Products(){
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [sort, setSort] = useState("");
    const [order, setOrder] = useState("");

    const getToken = () => localStorage.getItem("token");
    
    //FETCH PRODUCT
    const fetchProducts = async (sort = "", order = "") => {
        try{
        let url = api_url;

            if (sortField && sortOrder) {
                url += `?sort=${sortField}&order=${sortOrder}`;
            }

            const res = await fetch(url, {
                headers: {
                "Authorization": `Bearer ${getToken()}`
                }
            });

            const data = await res.json();
            setProducts(data);

            }catch (err){
            console.error("Error fetching products ", err);
        }
    };

    useEffect(()=> {
        fetchProducts();}, []);

//HANDLE INPUT

const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.productName]: e.target.price,    
    });
};
  //ADD PRODUCT
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
     fetchProducts();
    } catch (err) {
         console.error("Error adding product:", err); 
        }
    };
    //UPDATE PRODUCT
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

         fetchProducts();
        } catch (err) {
            Console.error("Error updating product:", err);
        }
    };
    //DELETE PROD
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

     const handleSubmit = (e) => {
         e.preventDefault();

         if (form._id) {
            updateProduct();
        } else {
            addProduct();
         }

         setForm(initialForm);
        };
    const handleEdit = (product) => {
         setForm(product);
       };
       return (
         <div style={{ padding: "20px" }}>
        <h2>Products</h2>{
        /* SORT CONTROLS */
        }
         <div style={{ marginBottom: "15px" }}>
             <select onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By</option>
             <option value="productName">Name</option>
              <option value="productType">Type</option>
               <option value="price">Price</option>
               <option value="productQuantity">Quantity</option>
               </select>
         <select onChange={(e) => setOrder(e.target.value)}>
             <option value="">Order</option>
             <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
               </select>
     <button onClick={() => fetchProducts(sort, order)}>Apply</button>
     </div>

    {/* FORM */} 
     <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="productName" placeholder="Name"value={form.productName}
         onChange={handleChange} />
         <input name="productType" placeholder="Type"
         value={form.productType} onChange={handleChange}/>
          <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
          <input name="productQuantity" placeholder="Quantity" value={form.productQuantity}
          onChange={handleChange}/>
          <input name="productDescription" placeholder="Description" value={form.productDescription} onChange={handleChange}/>

         <button type="submit">
            {form._id ? "Update Product" : "Add Product"}
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
                <tr key={p._id}><td>{p.productName}</td>
                <td>{p.productType}</td>
                <td>{p.price}</td>
                <td>{p.productQuantity}</td>
                <td>{p.productDescription}</td>
                <td><button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => deleteProduct(p._id)}>
                    Delete </button>
                     </td>
                      </tr>))}
                      </tbody></table> </div>
        );
}