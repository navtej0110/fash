"use client";
import React, { useState, useEffect } from "react";
import { storePercentage } from "@/actions/accountAction";
import { Select, SelectItem, Button, Card,CardBody } from "@heroui/react";
import { toast } from "react-toastify";
const PercentForm = ({ percentage }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPercent, setSelectedPercent] = useState("");

  const percentOptions = [
    { label: "10%", key: "10" },
    { label: "20%", key: "20" },
    { label: "30%", key: "30" },
    { label: "40%", key: "40" },
    { label: "50%", key: "50" },
    { label: "60%", key: "60" }
  ];

  const handleChange = (e) => {
    setSelectedPercent(e.target.value); // Update the selected percentage state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedPercent === null) {
      toast.error("Please select a percentage.");
      return;
    }

    setLoading(true); // Show loading state

    try {
      const response = await storePercentage({ percentage: selectedPercent });
      if (response.status === 200) {
        toast.success(response.message);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("An error occurred while updating the percentage.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-12 border border-green-500">
      <CardBody>
        <form onSubmit={handleSubmit} >
            <label>Select Percentage on Products</label>
            <div className="flex  gap-3 items-center">
            <Select
            className="max-w-xs mt-3"
            placeholder="Select percantage"
            onChange={handleChange}
            defaultSelectedKeys={[percentage]}
          >
            {percentOptions.map((percent) => (
              <SelectItem key={percent.key}>{percent.label}</SelectItem>
            ))}
          </Select>
          <Button
            isLoading={loading}
            type="submit"
            color="success"
            className="text-lg px-6 py-3 text-white rounded-full hover:bg-green-500 mt-2"
          >
            Save
          </Button>
            </div>
       
        </form>
      </CardBody>
    </Card>
  );
};

export default PercentForm;
