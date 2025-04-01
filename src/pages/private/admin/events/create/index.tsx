import PageTitle from "../../../../../components/page-title";
import EventForm from "../common/event-form";

const CreateEventPage = () => {
  return (
    <div>
      <PageTitle title="Create Event" />

      <div className="!mt-5">
        <EventForm type="create" initialData={{}}/>
      </div>
    </div>
  );
};

export default CreateEventPage;
