import React, { useState } from 'react';
import { useAuth } from '../../Store/Auth';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BASE_URL } from '../../../config';
import { toast } from 'react-toastify';

function Contact() {
    const { darkMode, user, authorization } = useAuth();

    const [contact, setContact] = useState({
        email: user?.email || "",
        message: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInput = (e) => {
        setContact({
            ...contact,
            [e.target.name]: e.target.value
        });
    };

    const contactData = async (e) => {
        e.preventDefault();
        if (!contact.message.trim()) {
            return toast.error("Message cannot be empty.");
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/yoga/contact/send`, {
                method: "POST",
                headers: {
                    Authorization: authorization,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact),
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                toast.success("Message sent successfully");
                setContact({ ...contact, message: "" }); // Reset the message field
            } else {
                toast.error(data.message || "Failed to send message");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="signin-page">
            <div className="signin-page" style={{ backgroundColor: darkMode ? '#343434' : '' }}>
                <h1 className='text-primary mb-4'>Contact Us</h1>
                <Form onSubmit={contactData}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Email</Form.Label>
                        <Form.Control type="email" name='email' value={contact.email} readOnly placeholder="Enter email" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="message">
                        <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Message</Form.Label>
                        <Form.Control as="textarea" rows="5" name='message' placeholder='Write Here' value={contact.message} onChange={handleInput} aria-label="With textarea" required />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send"}
                    </Button>
                </Form>
            </div>
        </section>
    );
}

export default Contact;
