"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { deleteProductById } from "@/actions/productActions";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const SoldTable = ({ products }) => {
  const [localProducts, setLocalProducts] = useState(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]); // This will update the state when products prop changes

  if (!localProducts || localProducts.length === 0) {
    return <div>No products to display</div>;
  }
  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it!",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn-danger",
      },
    });
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await deleteProductById(productId);
        setLoading(false);
        if (response.status === 200) {
    
          toast.success("Product deleted successfully");
          setLocalProducts((prev) => prev.filter(pre => pre._id !== productId));
        } else {
          toast.error(response.error);
        }
      } catch (error) {
        toast.error("Error while deleting the product");
      }
    }
  };

  return (
    <div>
      <Table aria-label="Sold Products Table">
        <TableHeader>
          <TableColumn>SKU</TableColumn>
          <TableColumn>Product Name</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>Consignor Name</TableColumn>
          <TableColumn>Consignor Email</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {localProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.consignorName || "Store Owner"}</TableCell>
              <TableCell>{product.consignorEmail || "Store Owner"}</TableCell>
              <TableCell>
                <Button
                  isDisabled={loading}
                  onPress={() => handleDelete(product._id)}
                  className="danger-btn"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SoldTable;
