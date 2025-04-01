import { Button, Form, Input, Tag } from "antd";
import { EventFormStepProps } from "./index";
import { useState } from "react";

const General = ({ eventData, setEventData }: EventFormStepProps) => {
  const [guestInputValue, setGuestInputValue] = useState("");

  const onGuestAdd = () => {
    const existingGuests = new Set(eventData.guests || []);
    const newGuests = guestInputValue
      .split(",")
      .map((guest) => guest.trim()) // Trim whitespace
      .filter((guest) => guest.length > 0); // Avoid empty guests

    newGuests.forEach((guest) => existingGuests.add(guest)); // Ensure uniqueness

    setEventData({ ...eventData, guests: Array.from(existingGuests) });
    setGuestInputValue("");
  };

  const onGuestRemove = (index: number) => {
    const newGuests = [...(eventData.guests || [])];
    newGuests.splice(index, 1);
    setEventData({ ...eventData, guests: newGuests });
  };

  return (
    <div className="flex flex-col gap-5">
      <Form.Item label="Event Name" required>
        <Input
          placeholder="Event Name"
          value={eventData.name || ""}
          onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
        />
      </Form.Item>

      <Form.Item label="Description" required>
        <Input.TextArea
          placeholder="Description"
          value={eventData.description || ""}
          onChange={(e) =>
            setEventData({ ...eventData, description: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="Organizer" required>
        <Input
          placeholder="Organizer"
          value={eventData.organizer || ""}
          onChange={(e) =>
            setEventData({ ...eventData, organizer: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="Guest List (comma separated)" required>
        <div className="flex gap-5">
          <Input
            placeholder="Guest List (comma separated)"
            value={guestInputValue}
            onChange={(e) => setGuestInputValue(e.target.value)}
          />
          <Button onClick={onGuestAdd} disabled={!guestInputValue.trim()}>
            Add
          </Button>
        </div>
      </Form.Item>

      <div className="flex flex-wrap gap-5">
        {eventData.guests?.map((guest: string, index: number) => (
          <Tag key={index} closable onClose={() => onGuestRemove(index)}>
            {guest}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default General;
