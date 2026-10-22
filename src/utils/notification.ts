// import * as Notifications from "expo-notifications";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });
// export async function requestNotificationPermission() {
//   const { status } = await Notifications.requestPermissionsAsync();

//   if (status !== "granted") {
//     console.log("Notification permission not granted");
//     return false;
//   }

//   console.log("Notification permission granted");
//   return true;
// }

// export async function scheduleTestNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Tailor App",
//       body: "This is a test notification",
//       sound: true,
//     },
//     trigger: {
//       type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//       seconds: 5,
//     },
//   });
// }

// export async function scheduleDailyNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Tailor App",
//       body: "Check your orders for today.",
//       sound: true,
//     },
//     trigger: {
//       type: Notifications.SchedulableTriggerInputTypes.DAILY,
//       hour: 10,
//       minute: 53,
//     },
//   });
// }
// // Payment  notification 
// export async function showPaymentNotification(
//   orderId: number,
//   orderName: string,
//   customerName: string,
//   amount: number
// ) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Payment Received",
//       body: `Rs. ${amount} received\nOrder #${orderId} - ${orderName}\nCustomer: ${customerName}`,
//     },
//     trigger: null,
//   });
// }
// export async function showSimplePaymentNotification(
//   orderId: number,
//   amount: number
// ) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Payment Received",
//       body: `Order #${orderId} se Rs. ${amount} payment received.`,
//     },
//     trigger: null,
//   });
// }
// // Add order per notification 


// export async function showOrderNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "New Order",
//       body: "A new order has been added successfully.",
//     },
//     trigger: null,
//   });
// }

// export async function scheduleDailyMotivation() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Daily Motivation",
//       body: "Keep going. Your hard work today is building your success tomorrow.",
//     },
//     trigger: {
//       type: Notifications.SchedulableTriggerInputTypes.DAILY,
//       hour: 22,
//       minute: 0,
//     },
//   });
// }
