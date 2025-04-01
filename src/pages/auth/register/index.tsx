import { Link, useNavigate } from "react-router-dom";
import WelcomeContent from "../common/welcome-content";
import { Button, Form, Input, message } from "antd";
import { registerUser } from "../../../api-services/users-service";
import { useState } from "react";

function RegisterPage() {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: never) => {
    try {
      setLoading(true);
      const response = await registerUser(values);
      message.success(response.message);
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="col-span-1 lg:flex hidden">
        <WelcomeContent />
      </div>
      <div className="h-screen flex items-center justify-center">
        <Form 
          className="flex flex-col gap-5 w-96" 
          layout="vertical"
          onFinish={onFinish}
          >

          <h1 className="text-3xl !font-bold text-gray-600">
            Register your account
          </h1>

          <Form.Item 
            name='name' 
            required 
            label='Name'
            rules={[{ required: true }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name='email'
            required
            label='Email'
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name='password'
            required
            label='Password'
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            Register
          </Button>
          <Link to="/login">
            Alredy have an account?
            <span className="text-blue-400"> Login </span>
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;