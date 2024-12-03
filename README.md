## Project Name: Yoga E-Commerce Website

## Project Description
This yoga e-commerce platform provides a holistic experience for yoga enthusiasts by combining shopping, education, and community engagement. Users can sign up, log in, and securely manage sessions with JWT-based authentication stored in cookies. The platform features a product listing page, a cart for adding items, Razorpay integration for seamless payments, and a dedicated blog section to promote yoga awareness. This platform is built using the MERN stack to implement and manage **Role-Based Access Control (RBAC)**. It ensures secure access to resources based on user, admin, and moderator roles and permissions.

## Features
- **User Roles**:
  - Admin
  - Moderator
  - User
    
- **Role-Based Permissions**:
  - Admin: Has full access, including sensitive information, assigning roles, and managing all aspects of the platform.
  - Moderator: Limited access to reduce admin workload, with permissions to view/edit user and product info, add blogs, and approve product reviews. Moderators cannot     delete data or add new products.
  - User: Add reviews to products, track order history, manage multiple addresses with a primary address selection, and view social media posts about products.
    
- **Authentication**:
  - Secure Signin, Signup, and Signout functionality with encrypted password storage.
  - JWT Authentication for secure and scalable session management.
  - Cookies used to store authentication tokens for enhanced security.
    
- **Admin Panel**:
  - Comprehensive user, product, reviews and other resource management (view, edit, assign roles).
  - Assign roles dynamically (Admin, Moderator, User).
  - Audit user activity logs for transparency and accountability.
  - Ability to manage sensitive information and perform role-specific tasks.
   
- **Dashboard**:
  - Separate dashboards for Admins, Moderators with role-specific access and navigation.

- **Dynamic Access Control**:
  - Role-based access control to restrict or allow specific actions.
  - Secure handling of data visibility and actions based on user roles Admin, Moderator.

## Teconology Used
### **Frontend**
- **React.js**: Dynamic and component-based UI development.
- **Bootstrap**: Responsive and mobile-first design.
- **CSS**: CSS for styling.

### **Backend**
- **Node.js**: Server-side development and efficient handling of asynchronous requests.
- **Express.js**: Routing and middleware support.

### **Database**
- **MongoDB**: Document-based storage and seamless data management.
- **Mongoose**: Schema-based modeling and validation.

### **Authentication**
- **JSON Web Tokens (JWT)**: Stateless and secure user authentication.
- **Cookies**: Secure and convenient storage of session tokens.
- **Password Hashing**: Enhanced security using libraries like bcrypt.

## Future Enhancements:
- Planned additions include profile editing for users, a "recently viewed" section, product categorization, and an advanced admin dashboard with comprehensive         statistics for better platform management.

## My Role
- I independently designed and developed the entire yoga e-commerce platform, managing all aspects of the project. As the sole developer of this yoga e-commerce platform, I took complete ownership of the project, managing every aspect from concept to deployment.

## Implementing Role Based Access Control 
- In this project, I implemented Role-Based Access Control (RBAC) to manage user permissions and ensure that different users have appropriate access to various parts of the platform. The system has three roles: Admin, Moderator, and User.

### **Backend Implementation**
- I used a middleware function called verifyRole to handle role-based access control on the server side. The middleware checks if the logged-in user’s role matches the required roles for a given route. If the user does not have the correct role, the server responds with an "Access Denied" message and a 403 status. Otherwise, the request proceeds to the next middleware or route handler. This ensures that sensitive actions like assigning roles, managing products, and viewing user information are restricted to users with appropriate permissions.

### **Frontend Implementation**
- On the frontend, I added role checks to restrict access to certain pages and components based on the user's role. For example, when a user tries to access an admin or moderator page, the frontend checks if their role is either Admin or Moderator. If not, they are redirected to a different page. I also display a loading spinner while checking the user’s role to improve the user experience during role validation.

## Instructions how to set up and test my project.
### **Prerequisites**
Before setting up the project, make sure you have the following installed on your machine:
- **Node.js**
- **npm**
- **MongoDB**
- **Postman**
- **npm install** (for installing dependencies in frontend & backend)
- **npm run dev** (to start our frontend & backend)
  
### **Enviromental variable setup**
- Backend
  **PORT=7000**
  **MONGO_DB_URL="mongourl"**
  **ACCESS_TOKEN_SECRET_KEY**
  **ACCESS_TOKEN_EXPIRY**
  **CLOUDINARY_CLOUD_NAME**
  **CLOUDINARY_API_KEY**
  **CLOUDINARY_API_SECRET**
  **TWITTER_BEARER_TOKEN**
  **RAZORPAY_KEY_ID**
  **RAZORPAY_KEY_SECRET**
  
- Frontend
  **VITE_RAZORPAY_KEY_ID**

## To Testing Role Based Access
  ### **Admin**
  - **Email: biswo@gmail.com**
  - **Password: biswo#123**
  ### **Moderator**
  - **Email: biswojit@gmail.com**
  - **Password: biswojit#123**

## Deployement Link:-
  ### **https://yoga-app-eta-nine.vercel.app/**

## Conclusion
- This project is continuously evolving, and I am committed to improving it over time. While I have thoroughly tested the core features and ensured that the application functions as expected, I acknowledge that there may still be areas for improvement. I am actively working on enhancing the project, adding new features, and addressing any potential issues that arise. My goal is to make the platform more robust, user-friendly, and secure, ensuring an excellent experience for all users.



















  
