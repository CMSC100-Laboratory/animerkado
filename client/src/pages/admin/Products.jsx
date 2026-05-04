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
}