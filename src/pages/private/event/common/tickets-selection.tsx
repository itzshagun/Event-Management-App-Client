import { useState } from "react";
import { EventType } from "../../../../interfaces";
import { Button, Input, message } from "antd";
import PaymentModel from "./payment-model";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getClientSecret } from "../../../../api-services/payment-service";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const TicketsSelection = ({ eventData }: { eventData: EventType }) => {
  const [selectedTicketType, setSelectedTicketType] = useState<string>("");
  const [maxCount, setMaxCount] = useState<number>(1);
  const [selectedTicketsCount, setSelectedTicketsCount] = useState<number>(1);
  const [showPaymentModel, setShowPaymentModel] = useState<boolean>(false);
  const [stripeOptions, setStripeOptions] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const ticketTypes = eventData.ticketTypes;

  const selectedTicketPrice = ticketTypes.find(
    (ticketType) => ticketType.name === selectedTicketType
  )?.price;

  const totalAmount = (selectedTicketPrice || 0) * selectedTicketsCount;

  const getClientSecretAndOpenPaymentModel = async () => {
    try {
      setLoading(true);
      const response = await getClientSecret(totalAmount);

      setStripeOptions({
        clientSecret: response.clientSecret,
      });

      setTimeout(() => {
        setShowPaymentModel(true);
      }, 100);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-sm text-[#192BC2] !font-bold">
          Select ticket type
        </h1>
        <div className="flex flex-wrap gap-5 !mt-3">
          {ticketTypes.map((ticketType, index) => {
            const available = (ticketType as any).available ?? ticketType.limit;
            return (
              <div
                key={index}
                className={`!p-2 border border-gray-300 bg-gray-200 lg:w-96 w-full cursor-pointer
                ${
                  selectedTicketType === ticketType.name
                    ? "!border-2 !border-[#222831]"
                    : "border !border-gray-300"
                }
              `}
                onClick={() => {
                  setSelectedTicketType(ticketType.name);
                  setMaxCount(available);
                }}
              >
                <h1 className="text-sm text-gray-600 uppercase">
                  {ticketType.name}
                </h1>
                <div className="flex justify-between">
                  <h1 className="text-sm !font-bold">${ticketType.price}</h1>
                  <h1 className="text-xs !font-semibold">{available} Left</h1>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-sm text-[#192BC2] !font-bold !mt-10">
            Select number of tickets
          </h1>
          <Input
            type="number"
            value={selectedTicketsCount}
            className="!w-96"
            onChange={(e) =>
              setSelectedTicketsCount(
                Math.min(Math.max(1, parseInt(e.target.value) || 1), maxCount)
              )
            }
            min={1}
            max={maxCount}
          />

          <span className="text-gray-600 text-sm !mt-2 !font-bold                                                ">
            {selectedTicketsCount > maxCount
              ? `  Only ${maxCount} tickets available `
              : ""}
          </span>
        </div>

        <div className="!mt-7 flex justify-between bg-gray-200 border !border-solid !p-3 items-center">
          <h1 className="text-xl text-gray-500 !font-bold">
            Total Amount: $ {totalAmount}
          </h1>
          <Button
            type="primary"
            onClick={getClientSecretAndOpenPaymentModel}
            disabled={
              !selectedTicketType ||
              !selectedTicketsCount ||
              loading ||
              selectedTicketsCount > maxCount
            }
            loading={loading}
          >
            Book Now
          </Button>
        </div>
      </div>

      {stripeOptions?.clientSecret && (
        <Elements stripe={stripePromise} options={stripeOptions}>
          {showPaymentModel && (
            <PaymentModel
              showPaymentModel={showPaymentModel}
              setShowPaymentModel={setShowPaymentModel}
              totalAmount={totalAmount}
              selectedTicketType={selectedTicketType}
              selectedTicketsCount={selectedTicketsCount}
              event={eventData}
            />
          )}
        </Elements>
      )}
    </div>
  );
};

export default TicketsSelection;
