import { Cart } from "../models/Cart.js";

const addToCart = async (req, res) => {
    const newItem = new Cart({
        email: req.body.email,
        productId: req.body.productId,
        productName: req.body.productName,
        quantity: req.body.quantity,
        price: req.body.price
    });

    try{
        await newItem.save();
        return res.send({inserted: true});
    } catch(error){
        return res.send({inserted: false, error: error.message});
    }
}

const getCartItems = async (req,res) => {
    try{
        const {email} = req.query;
        
        let filter = {};

        if(email){
            filter = {email: email}
        }

        const items = await Cart.find(filter);
        return res.send(items);
    } catch (error){
        return res.send([]);
    }
}

const removeFromCart = async (req, res) => {
    try{
        const deleted = await Cart.deleteOne({ _id: req.params.itemId});
        return res.send(deleted);
    } catch (error){
        return res.send({deleted: false, error: error.message});
    }
}

const clearCart = async (req, res) => {
  try {
        const { email } = req.query
        await Cart.deleteMany({ email })
        return res.send({ cleared: true })
  } catch (error) {
        return res.status(500).send({ cleared: false, error: error.message })
  }
}

export {addToCart, getCartItems, removeFromCart, clearCart };