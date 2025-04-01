import { useCallback, useEffect, useState } from "react";
import PageTitle from "../../../../../components/page-title";
import EventForm from "../common/event-form";
import { message } from "antd";
import { getEventById } from "../../../../../api-services/event-service";
import { useParams } from "react-router-dom";
import Spinner from "../../../../../components/spinner";

const EditEventPage = () => {
  const [eventData, setEventData] = useState<Record<string, any>>({}); // ✅ Ensure eventData is always an object
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>(); // ✅ Ensure id is always a string

  const getData = useCallback(async () => {
    if (!id) return; // ✅ Avoids calling API with undefined id
    try {
      setLoading(true);
      const response = await getEventById(id);
      if (response?.data) {
        setEventData(response.data);
      } else {
        message.error("Event not found!");
      }
    } catch (error: any) {
      console.error("Error fetching event:", error);
      message.error("Failed to fetch event!");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]); // ✅ Ensures API is called when id changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Edit Event" />
      <div className="!mt-5">
        {Object.keys(eventData).length > 0 ? (
          <EventForm initialData={eventData} type="edit" />
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default EditEventPage;
