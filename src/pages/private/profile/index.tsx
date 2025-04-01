import { useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import PageTitle from "../../../components/page-title";
import { getDateTimeFormat } from "../../../helpers/date-time-formats";
import usersGlobalStore, { UsersStoreType } from "../../../store/users-store";
import { updateUserData } from "../../../api-services/users-service";

const ProfilePage = () => {
  const { currentUser, setCurrentUser }: UsersStoreType =
    usersGlobalStore() as UsersStoreType;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null; // Ensure user is loaded

  // Function to display user details
  const renderUserProperty = (label: string, value: any) => (
    <div className="flex flex-col text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 !font-semibold">{value}</span>
    </div>
  );

  // Open modal when user clicks "Edit Profile"
  const handleEdit = () => setIsModalOpen(true);

  // Function to handle profile updates
  const handleUpdate = async (values: any) => {
    try {
      setLoading(true);
      const updatedData = {
        userId: currentUser._id,
        ...values,
      }; // Ensure correct user ID is sent
      const response = await updateUserData(updatedData);

      message.success("Profile updated successfully");
      setCurrentUser(response.user); // Update global store with new user data
      setIsModalOpen(false);
    } catch (error: any) {
      message.error(error.response?.data.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageTitle title="Profile" />


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 !mt-7 border border-solid border-gray-400 !p-4">
        {renderUserProperty("User Id:", currentUser?._id)}
        {renderUserProperty("Name:", currentUser?.name)}
        {renderUserProperty("Email:", currentUser?.email)}
        {renderUserProperty(
          "Joined At:",
          getDateTimeFormat(currentUser.createdAt!)
        )}
        {renderUserProperty(
          "Status:",
          currentUser?.isActive ? "Active" : "Inactive"
        )}
        {renderUserProperty("Role:", currentUser?.isAdmin ? "Admin" : "User")}
      </div>

      <div className="flex justify-end">
        <Button className="!mt-4" onClick={handleEdit}>Edit Profile</Button>
      </div>


      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            name: currentUser.name,
            email: currentUser.email,
            oldPassword: "",
            newPassword: "",
          }}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Old Password" name="oldPassword">
            <Input.Password />
          </Form.Item>

          <Form.Item label="New Password" name="newPassword">
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Save Details
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
