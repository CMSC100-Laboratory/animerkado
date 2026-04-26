import Sale from "../models/Sale.js";

export const getSalesReport = async (req, res) => {
  try {
    const { filter } = req.query;

    let startDate = new Date();

    if (filter === "weekly") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (filter === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (filter === "annual") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      return res.status(400).json({ message: "Invalid filter" });
    }

    const report = await Sale.aggregate([
      { $match: { date: { $gte: startDate } } },
      {
        $group: {
          _id: "$productName",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    const total = await Sale.aggregate([
      { $match: { date: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);

    res.json({
      report,
      totalSales: total[0]?.totalRevenue || 0
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};