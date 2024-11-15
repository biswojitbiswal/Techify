import React, {useState} from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import './Admin.css'
import {toast} from 'react-toastify'
import {useAuth} from '../Store/Auth'


function Links() {
  const [postUrl, setPostUrl] = useState('');

  const {authorization} = useAuth();
 
  const handleInputChange = (event) => {
    setPostUrl(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();


    if (!postUrl) {
      toast.error('Please enter a URL.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/yoga/social/fetch-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        body: JSON.stringify({ url: postUrl }),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        toast.success('Post Saved Successfully.');
        setPostUrl("");
      } else {
        toast.error('Failed To Save Post Details.');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('An error occurred while submitting the post.');
    }
  };

  return (
    <>
      <section className="admin-social-forms">
        <h1>Add Social Media Posts</h1>
        <Form onSubmit={handleSubmit}>
        <Form.Label htmlFor="basic-url">Your Post URL: </Form.Label>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon3">URL</InputGroup.Text>
          <Form.Control
            id="basic-url"
            aria-describedby="basic-addon3"
            placeholder="https://example.com/..."
            value={postUrl}   // Bind input value to state
            onChange={handleInputChange} // Update state on input change
          />
        </InputGroup>
        <Button variant="primary" className="px-4 fs-3" type="submit">
          Post
        </Button>
      </Form>
      </section>
    </>
  )
}

export default Links
