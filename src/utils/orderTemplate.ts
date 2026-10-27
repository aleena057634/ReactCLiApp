
const orderTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      color: #172B34;
    }

    .header {
      text-align: center;
      border-bottom: 2px solid #C9A227;
      padding-bottom: 12px;
    }

    h1 {
      color: #164E63;
    }

    .row {
      padding: 12px 0;
      border-bottom: 1px solid #ddd;
    }

    .label {
      font-weight: bold;
    }
  </style>
</head>

<body>
  <div class="header">
    <h1>StitchMate</h1>
    <p>Your Style, Your Stitch</p>
    <h2>Order Receipt</h2>
  </div>

  <div class="row">
    <span class="label">Order ID:</span>
    <span>{{ORDER_ID}}</span>
  </div>

  <div class="row">
    <span class="label">Customer Name:</span>
    <span>{{CUSTOMER_NAME}}</span>
  </div>

  <div class="row">
    <span class="label">Garment:</span>
    <span>{{GARMENT}}</span>
  </div>

  <div class="row">
    <span class="label">Advance Payment:</span>
    <span>Rs. {{ADVANCE}}</span>
  </div>

  <div class="row">
    <span class="label">Remaining Payment:</span>
    <span>Rs. {{REMAINING}}</span>
  </div>
</body>
</html>
`;

export default orderTemplate;

