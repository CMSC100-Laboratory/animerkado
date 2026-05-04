import { verifyAdmin,verifyToken } from "../middleware/middleware.js";
import { getSalesReport } from "../controllers/salesController.js";

const salesRoutes = (app) =>{
    app.get("/api/orders/sales", verifyToken, verifyAdmin, getSalesReport);
}

export default salesRoutes;