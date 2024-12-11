import React from "react";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  SectionType,
} from "docx";

interface OrderDetail {
  productName: string;
  productPrice: number;
  priceAfterDiscount: number;
  size: string;
  color: string;
  quantity: number;
}

interface Order {
  orderId: number;
  employeeName: string;
  orderExportDateTime: string;
  orderNotice: string;
  orderDetails: OrderDetail[];
  totalAmount: number;
  total: number;
}

interface ReportComponentProps {
  orders: Order[];
}

const ReportComponent: React.FC<ReportComponentProps> = ({ orders }) => {
  const generateReport = async () => {
    try {
      console.log("Button clicked - generating report...");

      // Validate data
      if (!orders || orders.length === 0) {
        console.warn("No orders available to generate the report.");
        return;
      }
      console.log("Orders:", orders);

      // Group orders by month and calculate total sales
      const monthlySales: { [key: string]: number } = {};

      orders.forEach((order) => {
        const date = new Date(order.orderExportDateTime);
        const monthYear = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

        if (!monthlySales[monthYear]) {
          monthlySales[monthYear] = 0;
        }
        monthlySales[monthYear] += order.total;
      });

      console.log("Monthly Sales Data:", monthlySales);

      // Prepare rows for the table displaying each month's sales
      const rows = Object.keys(monthlySales).map((month) => {
        return new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: month })],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({ text: monthlySales[month].toLocaleString() }),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
          ],
        });
      });

      // Create the document
      const doc = new Document({
        sections: [
          {
            properties: { type: SectionType.CONTINUOUS },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Monthly Sales Report",
                    bold: true,
                    size: 28,
                  }),
                ],
              }),
              new Paragraph({
                text: "This report provides a summary of total sales by month.",
              }),
              new Paragraph({ text: "" }), // Empty paragraph for spacing
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: "Month" })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "Total Sales" })],
                      }),
                    ],
                  }),
                  ...rows,
                ],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({ text: "Detailed Order Information" }),
              // Add table for detailed order information
              ...orders.map((order) => {
                return new Table({
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph({ text: "Order ID" })],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({ text: order.orderId.toString() }),
                          ],
                        }),
                      ],
                    }),
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph({ text: "Employee Name" })],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({ text: order.employeeName }),
                          ],
                        }),
                      ],
                    }),
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph({ text: "Order Date" })],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({ text: order.orderExportDateTime }),
                          ],
                        }),
                      ],
                    }),
                    ...order.orderDetails.map((detail) => {
                      return new TableRow({
                        children: [
                          new TableCell({
                            children: [new Paragraph({ text: "Product Name" })],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({ text: detail.productName }),
                            ],
                          }),
                        ],
                      });
                    }),
                  ],
                });
              }),
            ],
          },
        ],
      });

      console.log("Document created successfully.");

      // Generate and download the Word file
      const blob = await Packer.toBlob(doc);
      console.log("Blob created:", blob);

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Monthly_Sales_Report.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Report downloaded successfully.");
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        maxWidth: "80%",
        margin: "0 auto",
      }}
    >
      {/* Title and Description */}
      <h2 style={{ color: "#333", fontSize: "24px", fontWeight: "bold" }}>
        Monthly Sales Report
      </h2>
      <p style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}>
        Download the sales report for the month, including total sales, product
        details, and order summaries.
      </p>

      {/* Report Details */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <p style={{ fontSize: "14px", color: "#333" }}>
          <strong>Date Range:</strong> January 2024 - December 2024
        </p>
        <p style={{ fontSize: "14px", color: "#333" }}>
          <strong>Report Type:</strong> Monthly Sales Overview
        </p>
      </div>

      {/* Button */}
      <button
        onClick={generateReport}
        style={{
          padding: "12px 24px",
          backgroundColor: "#ff7300",
          border: "none",
          color: "white",
          fontSize: "1.1rem",
          cursor: "pointer",
          borderRadius: "8px",
          transition: "background-color 0.3s",
        }}
      >
        <span
          role="img"
          aria-label="download-icon"
          style={{ marginRight: "10px" }}
        >
          📊
        </span>
        Download Report
      </button>

      {/* Disclaimer */}
      <p style={{ color: "#777", fontSize: "14px", marginTop: "20px" }}>
        Data covers sales for the selected time period. Contact support for
        custom reports.
      </p>
    </div>
  );
};

export default ReportComponent;
