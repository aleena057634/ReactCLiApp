
// import { Platform } from 'react-native';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';

// import { Order_detail } from '../database/order';

// // HTML template ko TypeScript string ke taur par read karne ke liye
// // Metro bundler ke raw-loader support ki zaroorat ho sakti hai.
// // Is liye neeche template ko string parameter ke taur par pass karenge.

// type OrderPdfData = {
//   orderId: number;
//   htmlTemplate: string;
//   customerName: string;
//   garment: string;
//   advance: string | number;
//   remaining: string | number;
// };

// function escapeHtml(value: unknown): string {
//   return String(value ?? '')
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#39;');
// }

// export async function createOrderPdf({
//   orderId,
//   htmlTemplate,
//   customerName,
//   garment,
//   advance,
//   remaining,
// }: OrderPdfData) {
//   if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
//     throw new Error('PDF generation is supported on mobile devices.');
//   }

//   const order = await Order_detail(orderId);

//   if (!order) {
//     throw new Error('Order not found.');
//   }

//   const html = htmlTemplate
//     .replace(/\{\{ORDER_ID\}\}/g, escapeHtml(order.ORDER_ID))
//     .replace(/\{\{CUSTOMER_NAME\}\}/g, escapeHtml(customerName))
//     .replace(/\{\{GARMENT\}\}/g, escapeHtml(garment))
//     .replace(/\{\{ADVANCE\}\}/g, escapeHtml(advance))
//     .replace(/\{\{REMAINING\}\}/g, escapeHtml(remaining));

//   const file = await RNHTMLtoPDF.convert({
//     html,
//     fileName: `StitchMate_Order_${orderId}`,
//     directory: 'Documents',
//   });

//   if (!file.filePath) {
//     throw new Error('PDF file could not be created.');
//   }

//   return file.filePath;
// }
