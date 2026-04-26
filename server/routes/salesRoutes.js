import { getSalesReport } from "./controllers/salesController.js";

const salesRoutes = (app) =>{
    router.get("/sales", getSalesReport);
}

export default salesRoutes;