import React, { useState } from 'react'
import './Admin.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import imageCompression from 'browser-image-compression';
import { useAuth } from '../Store/Auth';
import { toast } from 'react-toastify';


function Publish() {
  const [blog, setBlog] = useState({
    blogTitle: "",
    blogDescription: "",
    blogImg: null
  })

  const {authorization} = useAuth();

  const handleBlogData = (e) => {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value
    })
  }

  const handleImageUpload = async(e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        setBlog({ ...blog, blogImg: compressedFile });
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("blogTitle", blog.blogTitle);
    formData.append("blogDescription", blog.blogDescription);
    formData.append("blogImg", blog.blogImg)

    try {
      const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/admin/publish/add`, {
        method: "POST",
        headers: {
          Authorization: authorization
        },
        body: formData
      })

      const data = await response.json();
      // console.log(data)

      if(response.ok){
        toast.success("New Blog Added")
        setBlog({blogTitle: "", blogDescription: "", blogImg: null})
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="admin-publish-form">
        <h1 className='text-primary mb-4'>Add Blog</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="blogTitle">
            <Form.Label>Title:</Form.Label>
            <Form.Control type="text" name='blogTitle' value={blog.blogTitle} onChange={handleBlogData} placeholder="Enter Title" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="blogDescription">
            <Form.Label>Description:</Form.Label>
            <Form.Control as="textarea" rows={5} name='blogDescription' value={blog.blogDescription} onChange={handleBlogData} />
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Blog Image:</Form.Label>
            <Form.Control type="file" name='blogImg' onChange={handleImageUpload}
              accept="image/*"/>
          </Form.Group>
          <Button variant="primary" type="submit" className='fs-5'>
            Publish
          </Button>
        </Form>
      </div>
    </>
  )
}

export default Publish
