import { getSalesReport } from "../controllers/salesController";

const salesRoutes = (app) =>{
    app.get("/sales", getSalesReport);
}

export default salesRoutes;