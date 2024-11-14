import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import './Blog.css'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';


function Blog() {
  const [blogs, setBlogs] = useState([]);

  const {authorization, user} = useAuth();

  const getAllBlogs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/yoga/blog/getblog`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setBlogs(data.blogs)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteBlog = async(blogId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/yoga/admin/blog/delete/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: authorization,
        }
      })

      const data = await response.json();
      // console.log(data);

      if(response.ok){
        toast.success("Blog Removed");
        setBlogs((prevBlogs) => prevBlogs.filter(prevblog => prevblog._id !== data.blog._id));
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.log(error);
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
              blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <div key={blog._id} className="blog-card">
                <img src={blog.blogImg} alt="Product Image" />
                <Card>
                <Card.Header className='fs-3 text-primary d-flex justify-content-between'>
                  <h4>{blog.blogTitle}</h4>
                  {
                    user?.isAdmin ? <Button variant='danger' onClick={() => handleDeleteBlog(blog._id)} className='fs-5'>Delete<span><i className="fa-solid fa-trash"></i></span></Button> : null

                  }
                </Card.Header>
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
              </div>
              ))
            ) : (
              <p>Blog Not Found</p>
            )
          }
          
            
        </div>
      </section >
    </>
  )
}

export default Blog
