import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import { useAuth } from "../Store/Auth";
import { Form } from "react-bootstrap";

function Brand({ selectedCategory, handleBrand, selectedBrand }) {
  const [brands, setBrands] = useState([]);
  
  const { authorization } = useAuth();

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchBrands = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/techify/admin/brand?category=${selectedCategory}`, {
          method: "GET",
          headers: {
            Authorization: authorization,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setBrands(data.brands);
        } else {
          toast.error("Failed to fetch brands");
        }
      } catch (error) {
        toast.error("Error fetching brands");
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, [selectedCategory]);

  return (
    <Form.Group className="mb-3" controlId="brandSelect">
      <Form.Label>Brand</Form.Label>
      <Form.Select 
        aria-label="Brand select" 
        value={selectedBrand} 
        onChange={(e) => handleBrand(e.target.value)}
      >
        <option>Select Brand</option>
        {brands?.map((brand) => (
          <option key={brand._id} value={brand._id}>
            {brand.name.charAt(0).toUpperCase() + brand.name.substring(1)}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}

export default Brand;
