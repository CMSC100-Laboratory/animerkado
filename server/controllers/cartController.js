import { Cart } from "../models/Cart.js";

const addToCart = async (req, res) => {
    try {
        const { email, productId, productName, productImage, quantity, price } = req.body;

        const existing = await Cart.findOne({ email, productId });

        if (existing) {
            existing.quantity += quantity;
            await existing.save();
            return res.send({ inserted: true, stacked: true });
        }

        const newItem = new Cart({ email, productId, productName, productImage, quantity, price });
        await newItem.save();
        return res.send({ inserted: true, stacked: false });
    } catch (error) {
        return res.send({ inserted: false, error: error.message });
    }
};

const getCartItems = async (req, res) => {
    try {
        const { email } = req.query;
        const filter = email ? { email } : {};
        const items = await Cart.find(filter);
        return res.send(items);
    } catch (error) {
        return res.send([]);
    }
};

const removeFromCart = async (req, res) => {
    try {
        const deleted = await Cart.deleteOne({ _id: req.params.itemId });
        return res.send(deleted);
    } catch (error) {
        return res.send({ deleted: false, error: error.message });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (quantity <= 0) {
            await Cart.deleteOne({ _id: req.params.itemId });
            return res.send({ updated: true, removed: true });
        }

        const updated = await Cart.findByIdAndUpdate(
            req.params.itemId,
            { quantity },
            { new: true }
        );

        if (!updated) return res.status(404).send({ updated: false, error: 'Item not found' });
        return res.send({ updated: true, item: updated });
    } catch (error) {
        return res.send({ updated: false, error: error.message });
    }
};

export { addToCart, getCartItems, removeFromCart, updateCartQuantity };