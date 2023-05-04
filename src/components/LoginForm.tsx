import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import Table from "../components/Table";
import { API_ENDPOINT } from "../constants";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");

  useEffect(() => {
    const userToken = JSON.parse(JSON.stringify(token))
    localStorage.setItem('userToken', userToken );
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
    localStorage.setItem('userEmail', email);
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = { email, password };
      const response = await axios.post(`${API_ENDPOINT}auth/`, data);
      const token = response.data.token;
      setToken(token);
      setIsAuthenticated(true);
      setEmail(email);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    setToken(null);
    setIsAuthenticated(false);
    setEmail('');
  }

  if (isAuthenticated) {
    return( 
    <div>
      
      <div className="header-auth">
        You are logged in as {email}
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      
      <Table />
    </div>);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </FormGroup>
      <Button color="primary" type="submit">
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;