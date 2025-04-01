import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import { BookingType } from "../../../../interfaces";
import { message, Popconfirm, Table } from "antd";
import {
  cancelBooking,
  getUserBookings,
} from "../../../../api-services/booking-service";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();
      setBookings(response.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onCancelBooking = async (booking: BookingType) => {
    try {
      setLoading(true);
      const paylaod = {
        eventId: booking.event._id,
        ticketTypeName: booking.ticketType,
        ticketsCount: booking.ticketsCount,
        bookingId: booking._id,
        paymentId: booking.paymentId,
      };
      await cancelBooking(paylaod);
      message.success("Booking cancelled successfully!");
      getData();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Event Name",
      dataIndex: "event",
      key: "event",
      render: (event: any) => event.name,
    },
    {
      title: "Event Date & Time",
      dataIndex: "event",
      key: "event",
      render: (event: any) => getDateTimeFormat(`${event.date} ${event.time}`),
    },
    {
      title: "Ticket Type",
      dataIndex: "ticketType",
      key: "ticketType",
    },
    {
      title: "Tickets Count",
      dataIndex: "ticketsCount",
      key: "ticketsCount",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => status.toUpperCase(),
    },
    {
      title: "Booked On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: any) => getDateTimeFormat(createdAt),
    },
    {
      title: "Action",
      key: "action",
      render: (record: BookingType) => {
        if (record.status === "booked") {
          return (
            <Popconfirm
              title="Are you sure you want to cancel this booking?"
              onConfirm={() => onCancelBooking(record)}
              okText="Yes"
              cancelText="No"
            >
              <span className="text-red-500 cursor-pointer text-sm underline">
                Cancel
              </span>
            </Popconfirm>
          );
        }
        return "";
      },
    },
  ];

  return (
    <div>
      <PageTitle title="Bookings" />

      <Table
        dataSource={bookings}
        columns={columns}
        loading={loading}
        rowKey="_id"
        size="small"
        bordered
        pagination={false}
      />
    </div>
  );
};

export default UserBookingsPage;
