import React from "react";
import { getProductById } from "@/actions/productActions";
import BackButton from "./BackButton";
import ImageCarousel from "@/app/product/components/ImageCarousel";

const page = async ({ params }) => {
  let product = null;

  const { productId } = await params;
  try {
    product = await getProductById(productId);
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  const parsedProduct = product ? JSON.parse(product) : null;
  if (!parsedProduct) {
    return <p>Product not found</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16  p-6 lg:p-12">
      {/* <BackButton /> */}
      <div className="w-full lg:w-1/2 flex flex-col items-center">
        <ImageCarousel images={parsedProduct.images} />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{parsedProduct.title}</h1>
        <ul className="space-y-2 text-gray-600">
          <li>
            <strong>Brand:</strong> {parsedProduct.brand}
          </li>
          <li>
            <strong>Price:</strong> ${parsedProduct.price}
          </li>
          <li className="">
            <strong>Link:</strong>
            {`https://fash-roan.vercel.app/product/${parsedProduct._id}`}
          </li>
        </ul>
        <p className="text-gray-700">{parsedProduct.description}</p>
      </div>
    </div>
  );
};

export default page;
