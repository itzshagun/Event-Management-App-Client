import { Button, message, Table } from "antd";
import PageTitle from "../../../../components/page-title";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteEvent, getEvents } from "../../../../api-services/event-service";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";
import { Edit2Icon, Trash2 } from "lucide-react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getEvents({
        searchText: "",
        date: "",
      });
      setEvents(response.data);
    } catch (error: any) {
      message.error(" Failed to Fetch Events", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEventHandler = async (id: string) => {
    try {
      setLoading(true);
      await deleteEvent(id);
      getData();
      message.success("Event deleted successfully!");
    } catch (error) {
      message.error("Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (date: any, row: any) => {
        return getDateTimeFormat(`${date}  ${row.time}`);
      },
      key: "date",
    },
    {
      title: "Orgainzer",
      dataIndex: "organizer",
      key: "organizer",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date: any) => getDateTimeFormat(date),
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <div className="flex gap-5">
          <Trash2
            className="cursor-pointer text-red-600"
            size={16}
            onClick={() => deleteEventHandler(record._id)}
          />
          <Edit2Icon
            className="cursor-pointer text-teal-800 "
            size={16}
            onClick={() => {
              console.log("Navigating to edit event with ID:", record._id);
              if (!record._id) {
                message.error("Event ID is missing! Cannot edit.");
                return;
              }
              navigate(`/admin/events/edit/${record._id}`);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Events" />
        <Button type="primary" onClick={() => navigate("/admin/events/create")}>
          Create Event{" "}
        </Button>
      </div>
      <Table dataSource={events} columns={columns} loading={loading} />
    </div>
  );
};

export default EventsPage;
