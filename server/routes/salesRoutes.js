import { getSalesReport } from "../controllers/salesController.js";

const salesRoutes = (app) =>{
    app.get("/api/orders/sales", getSalesReport);
}

export default salesRoutes;