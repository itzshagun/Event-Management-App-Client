import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import AdminReportsFilters from "./filters";
import { message, Table } from "antd";
import { getEvents } from "../../../../api-services/event-service";
import { getAdminReports } from "../../../../api-services/reports-service";
import ReportCard from "./report-card";

const AdminReports = () => {
  const [reports, setReports] = useState<any>({});
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    eventId: "",
  });

  const getReports = async () => {
    try {
      const response = await getAdminReports(filters);
      setReports(response.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getEventData = async () => {
    try {
      const response = await getEvents({ searchText: "", date: "" });
      setEvents(response.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getEventData();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      getReports();
    }
  }, [events]);

  const ticketTypesColumns = [
    {
      title: "Ticket Type",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tickets Sold",
      dataIndex: "ticketsSold",
      key: "ticketsSold",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
    },
  ];

  return (
    <div>
      <PageTitle title="Reports" />
      <AdminReportsFilters
        events={events}
        filters={filters}
        setFilters={setFilters}
        onFilter={getReports}
      />

      <div className="!mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReportCard
          title="Total Bookings"
          description="Total no. of Bookings made by users"
          value={reports.totalBookings}
          isAmountProperty={false}
        />
        <ReportCard
          title="Cancelled Booking"
          description="Total no. of Cancelled Bookings by users"
          value={reports.cancelledBookings}
          isAmountProperty={false}
        />

        <ReportCard
          title="Total Revenue"
          description="Total revenue generated from all bookings"
          value={reports.totalRevenueCollected}
          isAmountProperty={true}
        />

        <ReportCard
          title="Refunded Amount"
          description="Total revenue refunded for cancelled bookings"
          value={reports.totalRevenueRefunded}
          isAmountProperty={true}
        />
        <ReportCard
          title="Tickets Sold"
          description="Total no. of tickets sold for all events"
          value={reports.totalTickets}
          isAmountProperty={false}
        />
        <ReportCard
          title="Tickets Cancelled"
          description="Total no. of tickets cancelled for all events"
          value={reports.cancelledTickets}
          isAmountProperty={false}
        />
      </div>

      {reports.ticketTypesAndThierSales && (
        <div className="!mt-7 flex flex-col gap-5">
          <h1 className="text-[#192BC2] text-sm !font-bold col-span-4">
            Ticket Sales by Event
          </h1>

          <Table
            columns={ticketTypesColumns}
            dataSource={reports.ticketTypesAndThierSales}
          />
        </div>
      )}
    </div>
  );
};

export default AdminReports;
