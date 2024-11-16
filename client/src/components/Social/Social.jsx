import React, { useState, useEffect } from 'react'
import './Social.css'
import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';

function Social() {
  const [posts, setPosts] = useState([]);

  const getSocialMediaPost = async() => {
    try {
      const response = await fetch(`http://localhost:5000/api/yoga/social/get-posts`, {
        method: "GET"
      })

      const data = await response.json()
      // console.log(data.posts);

      if(response.ok){
        setPosts(data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSocialMediaPost();
  }, []);

  return (
    <>
      <section id='social-page'>
        <h2 className='fs-1'>What People Are Saying About Us</h2>
        <div className="social-media-posts">
          <Carousel data-bs-theme="dark" className='post-carousel'>
            {
              posts.length > 0 ? 
              posts.map(post => {
                return <Carousel.Item key={post._id}>
                <div className="customer-post">
                  <div className="user-details">
                    <div className="customer-profile">
                      <img src={post.author.profileImage} alt="Hero" />
                    </div>
                    <p className='fs-2'><strong>{post.author.username}</strong></p>
                  </div>
                  <div className="post-details">
                    <div className="post-content">
                      <p className='fs-4'>{post.text}</p>
                    </div>
                    <div className="post-metrics">
                      <p className='text-primary'><i className="fa-solid fa-thumbs-up fs-2"></i> <span className='fs-4'>{post.metrics.likes}</span></p>
                      <p className='text-primary'><i className="fa-solid fa-message fs-2"></i> <span className='fs-3'>{post.metrics.comments}</span></p>
                      <p className='text-primary'><i className="fa-solid fa-share-from-square fs-2"> <span className='fs-5 fw-normal'>{post.metrics.shares}</span></i></p>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
              }) : <h2>Loading posts...</h2>
            }
            
            {/* <Carousel.Item>
              <h1>Social media posts2</h1>
            </Carousel.Item>
            <Carousel.Item>
              <h1>Social media posts3</h1>
            </Carousel.Item> */}
          </Carousel>
        </div>
      </section>
    </>
  )
}

export default Social
