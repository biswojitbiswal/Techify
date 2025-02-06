import { Order } from "../models/order.model.js";

const cleanUpExpiredOrders = async () => {
    try {
      const fiveMinutesAgo  = new Date(Date.now() - 5 * 60 * 1000);
  
      
      const result = await Order.deleteMany({
        orderStatus: "Pending",
        createdAt: { $lt: fiveMinutesAgo  },
      });
  
      // console.log(`Deleted ${result.deletedCount} expired pending orders`);
    } catch (error) {
      console.error("Error deleting expired orders:", error);
    }
  };
  
  export default cleanUpExpiredOrders;