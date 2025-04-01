import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title";
import { message } from "antd";
import { getUserReports } from "../../../../api-services/reports-service";
import ReportCard from "../../admin/reports/report-card";

const UserReports = () => {
  const [reports, setReports] = useState<any>({});

  const getData = async () => {
    try {
      const response = await getUserReports();
      setReports(response.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <PageTitle title="Reports" />

      <div className="!mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReportCard
          title="Total Bookings"
          description="Total no. of Bookings made by current users"
          value={reports.totalBookings}
          isAmountProperty={false}
        />
        <ReportCard
          title="Cancelled Booking"
          description="Total no. of Cancelled Bookings by current users"
          value={reports.cancelledBookings}
          isAmountProperty={false}
        />

        <ReportCard
          title="Amount Spent"
          description="Total amount spent on bookings by current users"
          value={reports.totalAmountSpent}
          isAmountProperty={true}
        />

        <ReportCard
          title="Amount Refunded"
          description="Total amount refunded for cancelled bookings"
          value={reports.totalAmountReceivedAsRefund}
          isAmountProperty={true}
        />
        <ReportCard
          title="Tickets Purchased"
          description="Total no. of tickets purchased for all events by current user"
          value={reports.totalTickets}
          isAmountProperty={false}
        />
        <ReportCard
          title="Tickets Cancelled"
          description="Total no. of tickets cancelled for all events by current user"
          value={reports.cancelledTickets}
          isAmountProperty={false}
        />
      </div>
    </div>
  );
};

export default UserReports;
