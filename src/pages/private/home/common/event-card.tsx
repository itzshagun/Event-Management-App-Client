import { Button } from "antd";
import { EventType } from "../../../../interfaces";
import { MapPin, Timer } from "lucide-react";
import { getDateTimeFormat } from "../../../../helpers/date-time-formats";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }: { event: EventType }) => {
  const mainImage =
    event.images?.length > 0 && event.images[0]
      ? event.images[0].startsWith("http")
        ? event.images[0]
        : `/placeholder.jpg`
      : "/placeholder.jpg"; // Fallback in case no image is found

  const navigate = useNavigate();

  //   console.log("✅ Event data:", event);
  //   console.log("✅ Event images:", event.images);
  //   console.log("✅ Main image URL:", mainImage);

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 border border-solid border-gray-300 items-center gap-5">
      <div className="col-span-1">
        <img
          src={mainImage}
          alt={event.name}
          className="w-full h-60 object-cover rounded-l"
          onError={(e) => (e.currentTarget.src = "/fallback.jpg")} // Handle broken images
        />
      </div>
      <div className="col-span-2 flex flex-col gap-5 !p-3">
        <h1 className="text-[#222831] text-lg !font-semibold">{event.name}</h1>
        <p className="text-gray-600 text-sm line-clamp-3">
          {event.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="bg-gray-200 !p-2 rounded flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <MapPin size={16} />
              <p className="text-xs">
                {event.address} , {event.city} ,{event.pincode}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Timer size={16} />
              <p className="text-xs">
                {getDateTimeFormat(`${event.date} ${event.time}`)}
              </p>
            </div>
          </div>
          <Button
            type="primary"
            onClick={() => navigate(`/event/${event._id}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
