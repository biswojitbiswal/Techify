import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import './Blog.css'
import { Link } from 'react-router-dom'

function Blog() {
  const [blogs, setBlogs] = useState([]);

  const getAllBlogs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/yoga/blog/getblog`, {
        method: "GET",
      });

      const data = await response.json();
      console.log(data.blogs)

      if (response.ok) {
        setBlogs(data.blogs)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllBlogs();
  }, []);

  return (
    <>
      <section id="yoga-blog">
        <h1 className='text-primary fs-1 mb-2'>Welcome to Our Yoga Blog</h1>
        <h4 className='m-2'>Explore articles and tips on yoga, wellness, mindfulness, and how to enhance your practice.</h4>

        <div className="blog-container">
          <h2 className='mb-4'>Latest Articles</h2>
            {
              blogs.map((blog, index) => {
                return <Card className='blog-custom-card' key={index}>
                <Card.Header className='fs-3'>{blog.blogTitle}</Card.Header>
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p>{blog.blogDescription}</p>
                    <Link className='mb-2 text-decoration-none' to="www.google.com">Read More &rarr;</Link>
                    <footer className="blockquote-footer" style={{ marginTop: ".5rem" }}>
                      Published On {new Date(blog.createdAt).toDateString()}
                    </footer>
                  </blockquote>
                </Card.Body>
              </Card>
              })
            }
          
            
        </div>
      </section >
    </>
  )
}

export default Blog
