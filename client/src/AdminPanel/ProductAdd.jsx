import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Admin.css';
import { useAuth } from '../Store/Auth';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { BASE_URL } from '../../config.js';
import { useCategories } from '../Store/CategoryStore.jsx';


function ProductAdd() {
  const [brands, setBrands] = useState([]);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    images: [],
    category: "",
    brand: "",
    stock: "",
    specification: {},

  });

  const { authorization } = useAuth();
  const {categories} = useCategories();

  const handleAddSpecification = (e) => {
    if (!specKey.trim() || !specValue.trim()) {
      toast.error("Specification Key & Value Pair required");
      return;
    }

    setProductData((prev) => ({
      ...prev,
      specification: {
        ...prev.specification,
        [specKey]: specValue
      }


    }))
    setSpecKey("");
    setSpecValue("");
  }

  const handleProductInput = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategory = (categoryId) => {
    setProductData({
      ...productData,
      category: categoryId
    })
  }

  const handleBrand = (brandId) => {
    setProductData({
      ...productData,
      brand: brandId
    })
  }

  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];

    const validFiles = files.filter((file) => validExtensions.includes(file.type));
    if (validFiles.length !== files.length) {
      toast.error("Only JPEG, PNG, and JPG files are allowed.");
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFiles = await Promise.all(
        validFiles.map(async (file) => {
          const compressedBlob = await imageCompression(file, options);
          return new File([compressedBlob], file.name, { type: file.type });
        })
      );

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...compressedFiles],
      }));
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };


  const handleProductForm = async (e) => {
    e.preventDefault();

    if ([productData.title, productData.description, productData.price, productData.brand, productData.category, productData.stock, productData.specification].some((field) => !field || field.toString().trim() === "")) {
      toast.error("All fields Are Required");
      return;
    }
    // console.log(productData);

    try {
      const formData = new FormData();
      formData.append('title', productData.title);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('stock', productData.stock);
      formData.append('category', productData.category);
      formData.append('brand', productData.brand);

      formData.append('specification', JSON.stringify(productData.specification))

      productData.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch(`${BASE_URL}/api/techify/admin/add`, {
        method: "POST",
        headers: {
          Authorization: authorization,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Products Added Successfully");
        setProductData({ title: "", description: "", price: "", images: [], stock: "", category: "", brand: "", specification: {} });
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding the product.");
    }
  };

  

  useEffect(() => {
    if (!productData.category) return;

    const fetchBrands = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/techify/admin/brand?category=${productData.category}`, {
          method: "GET",
          headers: {
            Authorization: authorization,
          },
        });

        const data = await response.json();
        console.log(data)

        if (response.ok) {
          setBrands(data.brands);
        }
      } catch (error) {
        toast.error("Error fetching brands");
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, [productData.category]);

  return (
    <div className="admin-product-form" >
      <h1 className='text-primary mb-4'>Add Product</h1>
      <Form onSubmit={handleProductForm}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label className='text-black'>Title:</Form.Label>
          <Form.Control type="text" name='title' value={productData.title} onChange={handleProductInput} placeholder="Enter Title" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label className='text-black'>Description:</Form.Label>
          <Form.Control type="text" name='description' value={productData.description} onChange={handleProductInput} placeholder="Enter Description" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label className='text-black'>Price:</Form.Label>
          <Form.Control type="number" name='price' value={productData.price} onChange={handleProductInput} placeholder="Enter Price" required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label className='text-black'>Category:</Form.Label>
        {
          categories?.length > 0 ? <Form.Select aria-label="Default select example" value={productData.category} onChange={(e) => handleCategory(e.target.value)} >
            <option>Select Category</option>
            {
              categories.map((category, index) => {
                return <option key={index} value={category._id}>{category.name.charAt(0).toUpperCase() + category.name.substring(1)}</option>
              })
            }
          </Form.Select> : <Spinner size='sm' variant='primary'/>
        }
        </Form.Group>

        {
          productData.category ? brands.length > 0 ?
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Brand</Form.Label>
              <Form.Select aria-label="Default select example" value={productData.brand} onChange={(e) => handleBrand(e.target.value)}>
                <option>Select Brand</option>
                {
                  brands?.map((brand) => {
                    return <option key={brand._id} value={brand._id}>{brand.name.charAt(0).toUpperCase() + brand.name.substring(1)}</option>
                  })
                }

              </Form.Select>
            </Form.Group> : <Spinner size='sm' variant='primary'/> : ""
        }

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className='text-black'>Stock:</Form.Label>
          <Form.Control type="number" name='stock' value={productData.stock} onChange={handleProductInput} placeholder="Enter Stock" required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="specification">
          <Form.Label className='text-black'>Specification:</Form.Label>
          <div className='d-flex justify-content-between gap-2'>
            <Form.Control type="text" value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Enter Key" />

            <Form.Control type="text" value={specValue} onChange={(e) => setSpecValue(e.target.value)} placeholder="Enter Value" />

            <Button variant='outline-primary' onClick={handleAddSpecification}>ADD</Button>
          </div>
        </Form.Group>
        <div className='d-flex flex-column gap-1'>
          {Object.entries(productData.specification).map(([key, value], index) => (
            <div key={index} className='d-flex justify-content-between px-4 rounded-3 align-items-center' style={{ border: "1px solid gray" }}>
              <p className='mb-0 py-1'>{key.toUpperCase()}</p>
              <p className='mb-0 py-1'>{value.toUpperCase()}</p>
            </div>
          ))}
        </div>



        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label className='text-black'>Images:</Form.Label>
          <Form.Control type="file" onChange={handleFile} multiple />
        </Form.Group>
        <div className="image-preview">
          {productData.images.map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt="Preview" style={{ width: 100, height: 100, marginRight: 10 }} />
          ))}
        </div>

        <Button variant="primary" type="submit" className='fs-5'>
          Add Product
        </Button>
      </Form>
    </div>
  );
}

export default ProductAdd;
