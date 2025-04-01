import { useEffect, useState } from "react";
import { UserType } from "../../../../interfaces";
import { message, Table } from "antd";
import {
  getAllUsers,
  updateUserData,
} from "../../../../api-services/users-service";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";
import PageTitle from "../../../../components/page-title";

const UsersPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error: any) {
      message.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: any) => {  // ✅ FIXED: Accept `Partial<UserType>`
    try {
      setLoading(true);
      await updateUserData(data);  // ✅ FIXED: Ensures multiple fields update
      message.success("User updated successfully");
      getData(); // Refresh users after update
    } catch (error: any) {
      message.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns: any = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Joined At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => getDateTimeFormat(createdAt),
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin: boolean, row: UserType) => {
        return (
          <select
            value={isAdmin ? "admin" : "user"}
            className="!border !border-solid !border-gray-600"
            onChange={(e) => {
              const isAdminUpdated = e.target.value === "admin";
              updateUser({userId: row._id, isAdmin: isAdminUpdated, isActive: row.isActive });  // ✅ FIXED
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, row: UserType) => {
        return (
          <select
            value={isActive ? "active" : "blocked"}
            className="!border !border-solid !border-gray-600"
            onChange={(e) => {
              const isActiveUpdated = e.target.value === "active";
              updateUser({userId: row._id, isActive: isActiveUpdated, isAdmin: row.isAdmin} );  // ✅ FIXED
            }}
          >
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        );
      },
    },
  ];

  return (
    <div>
      <PageTitle title="Users" />
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
};

export default UsersPage;
